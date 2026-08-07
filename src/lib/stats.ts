import type { ParsedBackblast } from "@/lib/slack/parse-backblast";
import { SITE_TIMEZONE } from "@/lib/format";

export type StatKind = "q" | "attendance";

export type StatsPost = {
  id: string;
  date: string;
  ao: string;
  qic: string;
  title: string;
  paxRoster: string[];
  /** F3 names from the FNG field (empty if none). */
  fngNames: string[];
};

/** Lightweight posts for the client stats UI (no full body text). */
export function toStatsPosts(posts: ParsedBackblast[]): StatsPost[] {
  return posts.map((p) => ({
    id: p.id,
    date: p.date,
    ao: p.ao,
    qic: p.qic,
    title: p.title,
    paxRoster: p.paxRoster,
    fngNames: parseFngNames(p.fngs),
  }));
}

export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^@/, "");
}

/** Split multi-person fields like "Not Jake, Gandalf" or "A & B". */
export function splitPeopleField(field: string): string[] {
  if (!field?.trim()) return [];
  return field
    .split(/\s*(?:,|&|\/|\n|\band\b)\s*/i)
    .map((s) => s.trim())
    .filter(
      (s) =>
        s.length > 0 &&
        !/^tbd$/i.test(s) &&
        !/^q$/i.test(s) &&
        !/^none$/i.test(s) &&
        !/^n\/?a$/i.test(s)
    );
}

/** Parse FNG field string into display names. */
export function parseFngNames(fngs: string | undefined): string[] {
  if (!fngs?.trim() || /^none$/i.test(fngs.trim())) return [];
  return splitPeopleField(fngs).filter((s) => !/^U[A-Z0-9]{6,}$/i.test(s));
}

export function namesMatch(a: string, b: string): boolean {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return false;
  return na === nb;
}

export function isUsableName(raw: string): boolean {
  const cleaned = raw.trim();
  if (!cleaned || /^tbd$/i.test(cleaned) || /^q$/i.test(cleaned)) return false;
  if (/^none$/i.test(cleaned) || /^n\/?a$/i.test(cleaned)) return false;
  // Skip unresolved Slack IDs like U01ABC...
  if (/^U[A-Z0-9]{6,}$/i.test(cleaned)) return false;
  return true;
}

export function personIsQ(post: StatsPost, person: string): boolean {
  return splitPeopleField(post.qic).some((q) => namesMatch(q, person));
}

export function personAttended(post: StatsPost, person: string): boolean {
  if (post.paxRoster.some((p) => namesMatch(p, person))) return true;
  // Q is almost always present even if roster resolution missed them
  return personIsQ(post, person);
}

export function personOnFngList(post: StatsPost, person: string): boolean {
  return post.fngNames.some((n) => namesMatch(n, person));
}

/** Anyone listed as Q, PAX, or FNG on this post. */
export function personAppeared(post: StatsPost, person: string): boolean {
  return (
    personIsQ(post, person) ||
    personAttended(post, person) ||
    personOnFngList(post, person)
  );
}

/** YYYY-MM-DD in America/Chicago for a post date. */
export function postYmd(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function filterByDateRange(
  posts: StatsPost[],
  fromYmd: string,
  toYmd: string
): StatsPost[] {
  const from = fromYmd.trim();
  const to = toYmd.trim();
  return posts.filter((p) => {
    const ymd = postYmd(p.date);
    if (from && ymd < from) return false;
    if (to && ymd > to) return false;
    return true;
  });
}

function addName(byKey: Map<string, string>, raw: string) {
  if (!isUsableName(raw)) return;
  const cleaned = raw.trim();
  const key = normalizeName(cleaned);
  if (!key) return;
  if (!byKey.has(key)) byKey.set(key, cleaned);
}

/** Unique PAX names from Qs + rosters + FNGs, sorted A–Z. */
export function collectPaxNames(posts: StatsPost[]): string[] {
  const byKey = new Map<string, string>();

  for (const post of posts) {
    for (const q of splitPeopleField(post.qic)) addName(byKey, q);
    for (const p of post.paxRoster) addName(byKey, p);
    for (const f of post.fngNames) addName(byKey, f);
  }

  return [...byKey.values()].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export type StatResult = {
  count: number;
  matching: StatsPost[];
};

export function computeStat(
  posts: StatsPost[],
  person: string,
  kind: StatKind
): StatResult {
  if (!person.trim()) return { count: 0, matching: [] };

  const matching = posts.filter((p) =>
    kind === "q" ? personIsQ(p, person) : personAttended(p, person)
  );

  return { count: matching.length, matching };
}

export function defaultDateRange(posts: StatsPost[]): {
  from: string;
  to: string;
} {
  if (posts.length === 0) {
    const today = postYmd(new Date().toISOString());
    return { from: today, to: today };
  }
  const ymds = posts.map((p) => postYmd(p.date)).sort();
  return { from: ymds[0], to: ymds[ymds.length - 1] };
}

// ─── Leaderboard ───────────────────────────────────────────────────────────

export type LeaderboardRow = {
  rank: number;
  name: string;
  count: number;
};

function rankCounts(
  counts: Map<string, { name: string; count: number }>
): LeaderboardRow[] {
  return [...counts.values()]
    .filter((r) => r.count > 0)
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    })
    .map((r, i) => ({ rank: i + 1, name: r.name, count: r.count }));
}

function bump(
  map: Map<string, { name: string; count: number }>,
  raw: string
) {
  if (!isUsableName(raw)) return;
  const name = raw.trim();
  const key = normalizeName(name);
  const existing = map.get(key);
  if (existing) {
    existing.count += 1;
  } else {
    map.set(key, { name, count: 1 });
  }
}

/** Top Qs in the given post set. */
export function computeQLeaderboard(posts: StatsPost[]): LeaderboardRow[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const post of posts) {
    for (const q of splitPeopleField(post.qic)) bump(map, q);
  }
  return rankCounts(map);
}

/** Most posts attended (roster or Q) in the given post set. */
export function computeAttendanceLeaderboard(
  posts: StatsPost[]
): LeaderboardRow[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const post of posts) {
    const seen = new Set<string>();
    const candidates = [
      ...splitPeopleField(post.qic),
      ...post.paxRoster,
    ];
    for (const raw of candidates) {
      if (!isUsableName(raw)) continue;
      const key = normalizeName(raw);
      if (seen.has(key)) continue;
      seen.add(key);
      bump(map, raw);
    }
  }
  return rankCounts(map);
}

export type JoinRecord = {
  name: string;
  /** ISO timestamp of first appearance */
  firstDate: string;
  firstYmd: string;
  firstAo: string;
  firstTitle: string;
  /** True if they were listed as FNG on that first post */
  asFng: boolean;
};

/**
 * First appearance of each HIM across all posts (oldest first).
 * Appearance = Q, PAX roster, or FNG field.
 * Sorted most recent join first.
 */
export function computeFirstJoins(posts: StatsPost[]): JoinRecord[] {
  const oldestFirst = [...posts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const first = new Map<string, JoinRecord>();

  for (const post of oldestFirst) {
    const candidates: { raw: string; asFng: boolean }[] = [];
    for (const q of splitPeopleField(post.qic)) {
      candidates.push({ raw: q, asFng: false });
    }
    for (const p of post.paxRoster) {
      candidates.push({ raw: p, asFng: false });
    }
    for (const f of post.fngNames) {
      candidates.push({ raw: f, asFng: true });
    }

    for (const { raw, asFng } of candidates) {
      if (!isUsableName(raw)) continue;
      const key = normalizeName(raw);
      if (first.has(key)) {
        // If we already saw them, still mark asFng if this same-day post lists FNG
        // (only update if same first date and was FNG)
        const rec = first.get(key)!;
        if (rec.firstYmd === postYmd(post.date) && asFng) {
          rec.asFng = true;
        }
        continue;
      }
      first.set(key, {
        name: raw.trim(),
        firstDate: post.date,
        firstYmd: postYmd(post.date),
        firstAo: post.ao,
        firstTitle: post.title,
        asFng,
      });
    }
  }

  return [...first.values()].sort((a, b) => {
    // Most recent joiners first
    if (a.firstYmd !== b.firstYmd) return b.firstYmd.localeCompare(a.firstYmd);
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

// ─── CSV ───────────────────────────────────────────────────────────────────

export function escapeCsvCell(value: string | number): string {
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowsToCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];
  return lines.join("\r\n");
}

/** Browser-only download helper. */
export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
