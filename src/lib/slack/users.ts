import { paxNameOverrides } from "@/content/pax-names";

const SLACK_API = "https://slack.com/api";

export type UserDirectory = Map<string, string>;

type SlackMember = {
  id: string;
  name?: string;
  real_name?: string;
  profile?: {
    display_name?: string;
    display_name_normalized?: string;
    real_name?: string;
    real_name_normalized?: string;
  };
  deleted?: boolean;
  is_bot?: boolean;
};

type UsersListResponse = {
  ok: boolean;
  error?: string;
  members?: SlackMember[];
  response_metadata?: { next_cursor?: string };
};

function pickF3Name(member: SlackMember): string | null {
  // F3 nicknames almost always live in Slack "Display name"
  const display =
    member.profile?.display_name?.trim() ||
    member.profile?.display_name_normalized?.trim();
  const real =
    member.profile?.real_name?.trim() ||
    member.profile?.real_name_normalized?.trim() ||
    member.real_name?.trim();
  const name = display || real || member.name?.trim();
  if (!name || name === "slackbot") return null;
  // Strip common Slack clutter
  return name.replace(/\s*\(via F3 Nation\)\s*/i, "").trim();
}

/**
 * Load Slack workspace directory.
 * Requires bot scopes: users:read (and optionally users.profile:read).
 * After adding scopes in the Slack app, you must Reinstall to Workspace
 * so the bot token is re-issued with those scopes.
 */
export async function fetchSlackUserDirectory(
  token: string
): Promise<{ directory: UserDirectory; error?: string; source?: string }> {
  const directory: UserDirectory = new Map();
  let cursor: string | undefined;

  try {
    for (let page = 0; page < 20; page++) {
      const url = new URL(`${SLACK_API}/users.list`);
      url.searchParams.set("limit", "200");
      // Include locale etc.; profile fields need users:read
      if (cursor) url.searchParams.set("cursor", cursor);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        // Avoid caching failed missing_scope responses after scope upgrades
        cache: "no-store",
      });

      if (!res.ok) {
        return { directory, error: `Slack HTTP ${res.status}` };
      }

      const data = (await res.json()) as UsersListResponse;
      if (!data.ok) {
        if (data.error === "missing_scope") {
          return {
            directory,
            error:
              "missing_scope: bot token needs users:read. Reinstall the Slack app after adding scopes, then update SLACK_BOT_TOKEN.",
            source: "none",
          };
        }
        return { directory, error: data.error };
      }

      for (const member of data.members ?? []) {
        if (member.deleted || member.is_bot) continue;
        const f3Name = pickF3Name(member);
        if (f3Name) directory.set(member.id, f3Name);
      }

      cursor = data.response_metadata?.next_cursor || undefined;
      if (!cursor) break;
    }
  } catch (e) {
    return {
      directory,
      error: e instanceof Error ? e.message : "Failed to load users",
    };
  }

  return { directory, source: "users.list" };
}

/**
 * From Paxminer posts: Q field mentions + "Username (via F3 Nation)" on the bot message.
 */
export function learnNamesFromBackblastMessages(
  messages: Array<{
    username?: string;
    blocks?: Array<{ type?: string; text?: { text?: string } }>;
    text?: string;
  }>
): UserDirectory {
  const learned: UserDirectory = new Map();

  for (const message of messages) {
    const header =
      message.blocks?.find((b) => b.type === "section" && b.text?.text)?.text
        ?.text ?? "";
    const qLine = header.match(/\*Q\*:\s*([^\n*]+)/i)?.[1] ?? "";
    const qIds = [...qLine.matchAll(/<@([A-Z0-9]+)>/g)].map((m) => m[1]);

    const rawName = message.username?.replace(/\s*\(via F3 Nation\)\s*/i, "").trim();
    if (rawName && qIds.length > 0) {
      // Primary Q is usually the poster
      learned.set(qIds[0], rawName);
    }
  }

  return learned;
}

/** Merge: manual overrides win, then Slack API, then learned-from-Q. */
export function buildUserDirectory(
  fromApi: UserDirectory,
  learned: UserDirectory,
  overrides: Record<string, string> = paxNameOverrides
): UserDirectory {
  const merged: UserDirectory = new Map();

  for (const [id, name] of learned) merged.set(id, name);
  for (const [id, name] of fromApi) merged.set(id, name);
  for (const [id, name] of Object.entries(overrides)) {
    if (name.trim()) merged.set(id, name.trim());
  }

  return merged;
}

export function resolveUserName(
  userId: string,
  directory: UserDirectory
): string {
  return directory.get(userId) ?? `PAX-${userId.slice(-4)}`;
}
