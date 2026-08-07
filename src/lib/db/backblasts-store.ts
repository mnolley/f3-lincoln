import { get, put } from "@vercel/blob";
import type { ParsedBackblast } from "@/lib/slack/parse-backblast";
import { getSupabase } from "./supabase";

/** Private blob pathname for the durable backblast archive. */
const BLOB_PATH = "archive/backblasts.json";

export type BackblastRow = {
  id: string;
  ts: string;
  title: string;
  date: string;
  ao: string;
  qic: string;
  pax_roster: string[] | null;
  pax_count: number;
  fng_count: number;
  fngs: string;
  warm_a_rama: string;
  the_thang: string;
  cot: string;
  body: string;
  raw_text: string;
  username: string | null;
  source: string;
};

export function postToRow(post: ParsedBackblast): BackblastRow {
  return {
    id: post.id,
    ts: post.ts,
    title: post.title,
    date: post.date,
    ao: post.ao,
    qic: post.qic,
    pax_roster: post.paxRoster,
    pax_count: post.paxCount,
    fng_count: post.fngCount,
    fngs: post.fngs,
    warm_a_rama: post.warmARama,
    the_thang: post.theThang,
    cot: post.cot,
    body: post.body,
    raw_text: post.rawText,
    username: post.username ?? null,
    source: "slack",
  };
}

export function rowToPost(row: BackblastRow): ParsedBackblast {
  return {
    id: row.id,
    ts: row.ts,
    title: row.title,
    date: row.date,
    ao: row.ao,
    qic: row.qic,
    paxRoster: row.pax_roster ?? [],
    paxCount: row.pax_count ?? 0,
    fngCount: row.fng_count ?? 0,
    fngs: row.fngs ?? "",
    warmARama: row.warm_a_rama ?? "",
    theThang: row.the_thang ?? "",
    cot: row.cot ?? "",
    body: row.body ?? "",
    rawText: row.raw_text ?? "",
    username: row.username ?? undefined,
  };
}

function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function isArchiveConfigured(): boolean {
  return isBlobConfigured() || getSupabase() !== null;
}

async function streamToString(
  stream: ReadableStream<Uint8Array>
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  out += decoder.decode();
  return out;
}

function mergeById(
  a: ParsedBackblast[],
  b: ParsedBackblast[]
): ParsedBackblast[] {
  const map = new Map<string, ParsedBackblast>();
  for (const p of a) map.set(p.id, p);
  for (const p of b) map.set(p.id, p); // newer wins
  return [...map.values()].sort(
    (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime()
  );
}

// ─── Vercel Blob (primary) ─────────────────────────────────────────────────

async function loadFromBlob(): Promise<{
  posts: ParsedBackblast[];
  error?: string;
}> {
  if (!isBlobConfigured()) {
    return { posts: [], error: "Blob not configured" };
  }

  try {
    const result = await get(BLOB_PATH, {
      access: "private",
      useCache: false,
    });

    if (!result?.stream) {
      return { posts: [] }; // empty archive is fine
    }

    const text = await streamToString(result.stream);
    if (!text.trim()) return { posts: [] };

    const parsed = JSON.parse(text) as unknown;
    if (!Array.isArray(parsed)) {
      return { posts: [], error: "Archive JSON is not an array" };
    }

    // Support both full ParsedBackblast[] and row shapes
    const posts: ParsedBackblast[] = parsed.map((item) => {
      const rec = item as Record<string, unknown>;
      if (typeof rec.paxRoster !== "undefined" || typeof rec.pax_roster !== "undefined") {
        if (rec.pax_roster !== undefined) {
          return rowToPost(rec as unknown as BackblastRow);
        }
        return rec as unknown as ParsedBackblast;
      }
      return rec as unknown as ParsedBackblast;
    });

    return { posts };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Blob load failed";
    // First run: blob missing is not a hard error
    if (/not found|404|BlobNotFound/i.test(msg)) {
      return { posts: [] };
    }
    return { posts: [], error: msg };
  }
}

async function saveToBlob(
  posts: ParsedBackblast[]
): Promise<{ error?: string }> {
  if (!isBlobConfigured()) {
    return { error: "Blob not configured" };
  }

  try {
    await put(BLOB_PATH, JSON.stringify(posts), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return {};
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Blob save failed",
    };
  }
}

// ─── Supabase (optional secondary) ─────────────────────────────────────────

async function loadFromSupabase(): Promise<{
  posts: ParsedBackblast[];
  error?: string;
}> {
  const supabase = getSupabase();
  if (!supabase) return { posts: [] };

  const { data, error } = await supabase
    .from("f3_backblasts")
    .select("*")
    .order("date", { ascending: false });

  if (error) return { posts: [], error: error.message };
  return {
    posts: (data as BackblastRow[] | null)?.map(rowToPost) ?? [],
  };
}

async function saveToSupabase(
  posts: ParsedBackblast[]
): Promise<{ saved: number; error?: string }> {
  const supabase = getSupabase();
  if (!supabase || !posts.length) return { saved: 0 };

  const rows = posts.map((p) => ({
    ...postToRow(p),
    updated_at: new Date().toISOString(),
  }));

  const chunkSize = 100;
  let saved = 0;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await supabase.from("f3_backblasts").upsert(chunk, {
      onConflict: "id",
    });
    if (error) return { saved, error: error.message };
    saved += chunk.length;
  }
  return { saved };
}

// ─── Public API ────────────────────────────────────────────────────────────

/** Load all archived backblasts (newest first). */
export async function loadArchivedBackblasts(): Promise<{
  posts: ParsedBackblast[];
  error?: string;
}> {
  const [blob, supabase] = await Promise.all([
    loadFromBlob(),
    loadFromSupabase(),
  ]);

  const posts = mergeById(blob.posts, supabase.posts);
  const errors = [blob.error, supabase.error].filter(
    (e): e is string => Boolean(e) && e !== "Blob not configured"
  );

  return {
    posts,
    error: posts.length === 0 && errors.length ? errors.join(" · ") : undefined,
  };
}

/**
 * Merge new posts into the durable archive and persist.
 * Primary store: Vercel Blob. Secondary (if configured): Supabase.
 */
export async function upsertBackblasts(
  posts: ParsedBackblast[]
): Promise<{ saved: number; error?: string }> {
  if (!posts.length) return { saved: 0 };
  if (!isArchiveConfigured()) {
    return { saved: 0, error: "Archive not configured" };
  }

  const existing = await loadArchivedBackblasts();
  const merged = mergeById(existing.posts, posts);

  const errors: string[] = [];

  if (isBlobConfigured()) {
    const blobWrite = await saveToBlob(merged);
    if (blobWrite.error) errors.push(`Blob: ${blobWrite.error}`);
  }

  if (getSupabase()) {
    const sb = await saveToSupabase(posts);
    if (sb.error) errors.push(`Supabase: ${sb.error}`);
  }

  return {
    saved: posts.length,
    error: errors.length ? errors.join(" · ") : undefined,
  };
}
