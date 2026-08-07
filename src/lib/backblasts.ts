import {
  isArchiveConfigured,
  loadArchivedBackblasts,
  upsertBackblasts,
} from "@/lib/db/backblasts-store";
import {
  fetchSlackBackblastById as fetchSlackById,
  fetchSlackBackblasts,
} from "@/lib/slack/fetch-backblasts";
import type { ParsedBackblast } from "@/lib/slack/parse-backblast";

export type GetBackblastsResult = {
  posts: ParsedBackblast[];
  error?: string;
  /** True when at least some rows came from the durable archive */
  fromArchive?: boolean;
  /** How many were written to the archive this request */
  archivedCount?: number;
};

function mergePosts(
  archived: ParsedBackblast[],
  live: ParsedBackblast[]
): ParsedBackblast[] {
  const byId = new Map<string, ParsedBackblast>();

  // Archive first, then live overwrites with fresher parses
  for (const p of archived) byId.set(p.id, p);
  for (const p of live) byId.set(p.id, p);

  return [...byId.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Source of truth for backblasts:
 * 1. Pull live posts from Slack
 * 2. Persist them to Supabase archive
 * 3. Merge with everything already archived (so deleted Slack posts remain)
 */
export async function getBackblasts(options?: {
  limit?: number;
  maxPages?: number;
}): Promise<GetBackblastsResult> {
  const archiveEnabled = isArchiveConfigured();

  const [slackResult, archiveResult] = await Promise.all([
    fetchSlackBackblasts(options),
    archiveEnabled
      ? loadArchivedBackblasts()
      : Promise.resolve({ posts: [] as ParsedBackblast[], error: undefined }),
  ]);

  let archivedCount = 0;
  let archiveWriteError: string | undefined;

  if (slackResult.posts.length && archiveEnabled) {
    const write = await upsertBackblasts(slackResult.posts);
    archivedCount = write.saved;
    archiveWriteError = write.error;
  }

  const posts = mergePosts(archiveResult.posts ?? [], slackResult.posts);

  // Prefer data over hard failure when either source has posts
  if (posts.length === 0) {
    const error =
      slackResult.error ||
      archiveResult.error ||
      (archiveEnabled
        ? "No backblasts found in Slack or the archive."
        : undefined);
    return { posts: [], error };
  }

  const warnings: string[] = [];
  if (slackResult.error) {
    warnings.push(`Slack: ${slackResult.error}`);
  }
  if (archiveResult.error && archiveResult.error !== "Archive not configured") {
    warnings.push(`Archive read: ${archiveResult.error}`);
  }
  if (archiveWriteError) {
    warnings.push(`Archive save: ${archiveWriteError}`);
  }

  return {
    posts,
    error: warnings.length ? warnings.join(" · ") : undefined,
    fromArchive: (archiveResult.posts?.length ?? 0) > 0,
    archivedCount,
  };
}

export async function getBackblastById(
  id: string
): Promise<{ post?: ParsedBackblast; error?: string }> {
  // Prefer merged catalog (archive + recent Slack) so old posts survive
  const { posts, error } = await getBackblasts({ limit: 200, maxPages: 8 });

  const post =
    posts.find((p) => p.id === id || p.ts === id) ??
    posts.find((p) => p.ts.replace(".", "") === id.replace(".", ""));

  if (post) return { post };

  // Fallback: direct Slack lookup (may fail if message is gone)
  const slack = await fetchSlackById(id);
  if (slack.post) {
    if (isArchiveConfigured()) {
      await upsertBackblasts([slack.post]);
    }
    return { post: slack.post };
  }

  return {
    error: slack.error || error || "Backblast not found",
  };
}
