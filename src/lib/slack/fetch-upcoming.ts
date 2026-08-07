import {
  computeUpcomingFromAos,
  type UpcomingBeatdown,
} from "@/lib/schedule";
import type { SlackHistoryResponse, SlackMessage } from "./types";
import {
  parsePreblastMessage,
  parseScheduleLine,
  withPreblastDirectory,
  type ParsedPreblast,
} from "./parse-preblast";
import {
  buildUserDirectory,
  fetchSlackUserDirectory,
  learnNamesFromBackblastMessages,
} from "./users";

const SLACK_API = "https://slack.com/api";

function getToken(): string | null {
  return process.env.SLACK_BOT_TOKEN?.trim() || null;
}

/** Prefer explicit env; else resolve public channel named q-schedule. */
async function resolveScheduleChannelId(
  token: string
): Promise<string | null> {
  const fromEnv = process.env.SLACK_SCHEDULE_CHANNEL_ID?.trim();
  if (fromEnv) return fromEnv;

  try {
    const url = new URL(`${SLACK_API}/conversations.list`);
    url.searchParams.set("types", "public_channel");
    url.searchParams.set("limit", "200");
    url.searchParams.set("exclude_archived", "true");
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      ok: boolean;
      channels?: { id: string; name: string }[];
    };
    if (!data.ok || !data.channels) return null;
    const hit =
      data.channels.find((c) => c.name === "q-schedule") ||
      data.channels.find((c) => /q.?sign|schedule|preblast/i.test(c.name));
    return hit?.id ?? null;
  } catch {
    return null;
  }
}

async function slackGet(
  method: string,
  token: string,
  params: Record<string, string>
): Promise<SlackHistoryResponse & { channels?: { id: string; name: string }[] }> {
  const url = new URL(`${SLACK_API}/${method}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Slack HTTP ${res.status}`);
  return (await res.json()) as SlackHistoryResponse;
}

async function tryJoinChannel(token: string, channelId: string): Promise<void> {
  try {
    await fetch(`${SLACK_API}/conversations.join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel: channelId }),
      next: { revalidate: 0 },
    });
  } catch {
    // optional
  }
}

async function fetchChannelMessages(
  token: string,
  channelId: string,
  limit = 100
): Promise<{ messages: SlackMessage[]; error?: string }> {
  await tryJoinChannel(token, channelId);

  try {
    const data = await slackGet("conversations.history", token, {
      channel: channelId,
      limit: String(limit),
    });
    if (!data.ok) {
      return {
        messages: [],
        error: data.error ?? "unknown",
      };
    }
    return { messages: data.messages ?? [] };
  } catch (e) {
    return {
      messages: [],
      error: e instanceof Error ? e.message : "Failed to fetch schedule channel",
    };
  }
}

function collectPreblasts(
  messages: SlackMessage[],
  directory: Map<string, string>
): ParsedPreblast[] {
  return withPreblastDirectory(directory, () => {
    const out: ParsedPreblast[] = [];
    for (const m of messages) {
      const structured = parsePreblastMessage(m);
      if (structured) {
        out.push(structured);
        continue;
      }
      // Human / bot free-form lines in #q-schedule
      const text = m.text ?? "";
      if (text) {
        const line = parseScheduleLine(text, directory);
        if (line) out.push(line);
      }
      // Also scan section blocks
      for (const block of m.blocks ?? []) {
        if (block.type === "section" && block.text?.text) {
          const line = parseScheduleLine(block.text.text, directory);
          if (line) out.push(line);
        }
      }
    }
    return out;
  });
}

function namesMatchAo(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Next N beatdowns: AO calendar slots, enriched with Q/title from Slack
 * preblasts / #q-schedule when the bot can read them.
 */
export async function fetchUpcomingBeatdowns(options?: {
  count?: number;
}): Promise<{
  slots: UpcomingBeatdown[];
  error?: string;
  /** True when Slack schedule channel was read successfully */
  slackScheduleOk?: boolean;
}> {
  const count = options?.count ?? 3;
  const base = computeUpcomingFromAos(count);

  const token = getToken();
  if (!token) {
    return {
      slots: base,
      error:
        "Slack is not configured — showing calendar schedule only (Q unknown).",
      slackScheduleOk: false,
    };
  }

  const channelId = await resolveScheduleChannelId(token);
  const notes: string[] = [];

  let messages: SlackMessage[] = [];
  if (channelId) {
    const result = await fetchChannelMessages(token, channelId, 150);
    if (result.error) {
      if (result.error === "not_in_channel") {
        notes.push(
          "Invite the site bot to #q-schedule (or set SLACK_SCHEDULE_CHANNEL_ID and invite it) to pull live Q names from Paxminer."
        );
      } else {
        notes.push(`Schedule channel: ${result.error}`);
      }
    } else {
      messages = result.messages;
    }
  } else {
    notes.push(
      "No schedule channel found. Set SLACK_SCHEDULE_CHANNEL_ID or create a public #q-schedule channel and invite the bot."
    );
  }

  // Also scan #backblast for any future-dated preblasts (rare but free)
  const backblastId = process.env.SLACK_BACKBLAST_CHANNEL_ID?.trim();
  if (backblastId) {
    const bb = await fetchChannelMessages(token, backblastId, 50);
    if (bb.messages.length) {
      messages = [...messages, ...bb.messages];
    }
  }

  const { directory: fromApi } = await fetchSlackUserDirectory(token);
  const learned = learnNamesFromBackblastMessages(messages);
  const directory = buildUserDirectory(fromApi, learned);

  const preblasts = collectPreblasts(messages, directory);
  const byKey = new Map<string, ParsedPreblast>();
  for (const p of preblasts) {
    const key = `${p.ymd}|${p.ao.toLowerCase()}`;
    // Prefer entries that have a Q
    const existing = byKey.get(key);
    if (!existing || (p.qic && !existing.qic)) {
      byKey.set(key, p);
    }
  }

  const slots = base.map((slot) => {
    const key = `${slot.ymd}|${slot.ao.toLowerCase()}`;
    let hit = byKey.get(key);
    if (!hit) {
      // Match by date only if AO ambiguous
      hit = [...byKey.values()].find(
        (p) => p.ymd === slot.ymd && namesMatchAo(p.ao, slot.ao)
      );
    }
    if (!hit) {
      hit = [...byKey.values()].find((p) => p.ymd === slot.ymd);
    }
    if (!hit) return slot;

    return {
      ...slot,
      qic: hit.qic || slot.qic,
      title: hit.title || slot.title,
      source: hit.qic || hit.title ? ("merged" as const) : slot.source,
    };
  });

  return {
    slots,
    error: notes.length ? notes.join(" ") : undefined,
    slackScheduleOk: messages.length > 0 && !notes.some((n) => n.includes("Invite")),
  };
}
