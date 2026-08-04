import {
  parseBackblastMessage,
  withUserDirectory,
  type ParsedBackblast,
} from "./parse-backblast";
import type { SlackHistoryResponse, SlackMessage } from "./types";
import {
  buildUserDirectory,
  fetchSlackUserDirectory,
  learnNamesFromBackblastMessages,
} from "./users";

const SLACK_API = "https://slack.com/api";

export type SlackConfig = {
  token: string;
  channelId: string;
};

export function getSlackConfig(): SlackConfig | null {
  const token = process.env.SLACK_BOT_TOKEN?.trim();
  const channelId = process.env.SLACK_BACKBLAST_CHANNEL_ID?.trim();
  if (!token || !channelId) return null;
  return { token, channelId };
}

async function slackGet(
  method: string,
  token: string,
  params: Record<string, string>
): Promise<SlackHistoryResponse> {
  const url = new URL(`${SLACK_API}/${method}`);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Slack HTTP ${res.status}`);
  }

  return (await res.json()) as SlackHistoryResponse;
}

/**
 * Fetch channel history and return only Paxminer-formatted backblasts.
 * Resolves Slack user IDs → F3 names via users:read, Q-username learning, and overrides.
 */
export async function fetchSlackBackblasts(options?: {
  limit?: number;
  maxPages?: number;
}): Promise<{ posts: ParsedBackblast[]; error?: string }> {
  const config = getSlackConfig();
  if (!config) {
    return {
      posts: [],
      error:
        "Slack is not configured. Set SLACK_BOT_TOKEN and SLACK_BACKBLAST_CHANNEL_ID in the environment.",
    };
  }

  const limit = options?.limit ?? 50;
  const maxPages = options?.maxPages ?? 3;
  const messages: SlackMessage[] = [];
  let cursor: string | undefined;

  try {
    for (let page = 0; page < maxPages; page++) {
      const params: Record<string, string> = {
        channel: config.channelId,
        limit: String(Math.min(limit, 200)),
      };
      if (cursor) params.cursor = cursor;

      const data = await slackGet("conversations.history", config.token, params);

      if (!data.ok) {
        return {
          posts: [],
          error: `Slack API error: ${data.error ?? "unknown"}`,
        };
      }

      if (data.messages?.length) {
        messages.push(...data.messages);
      }

      cursor = data.response_metadata?.next_cursor || undefined;
      if (!cursor || !data.has_more) break;
    }
  } catch (e) {
    return {
      posts: [],
      error: e instanceof Error ? e.message : "Failed to reach Slack",
    };
  }

  // Build F3 name directory: overrides + Slack users API + learned Q names
  const { directory: fromApi } = await fetchSlackUserDirectory(config.token);
  const learned = learnNamesFromBackblastMessages(messages);
  // API display names should win over learned Q nicknames when available
  const directory = buildUserDirectory(fromApi, learned);

  const posts = withUserDirectory(directory, () =>
    messages
      .map(parseBackblastMessage)
      .filter((p): p is ParsedBackblast => p !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );

  return { posts };
}

export async function fetchSlackBackblastById(
  id: string
): Promise<{ post?: ParsedBackblast; error?: string }> {
  const ts =
    id.includes(".")
      ? id
      : id.length > 6
        ? `${id.slice(0, -6)}.${id.slice(-6)}`
        : id;

  const { posts, error } = await fetchSlackBackblasts({ limit: 100, maxPages: 5 });
  if (error) return { error };

  const post =
    posts.find((p) => p.id === id || p.ts === id || p.ts === ts) ??
    posts.find((p) => p.ts.replace(".", "") === id.replace(".", ""));

  if (!post) return { error: "Backblast not found" };
  return { post };
}
