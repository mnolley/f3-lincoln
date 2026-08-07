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

/**
 * Strip roster junk so "1 @Prime", "@Prime", and "Prime" are the same HIM.
 * Removes leading digits/list markers, @ signs, and non-letter noise.
 */
export function cleanPersonName(raw: string): string {
  if (!raw) return "";
  let s = raw.trim();

  // Slack/markdown bold leftovers
  s = s.replace(/^\*+|\*+$/g, "");

  // Leading list / count-o-rama markers: "1 ", "1.", "1)", "#1", "(1)", "2 - "
  s = s.replace(/^[#*\-•·▪]?\s*\(?\d+\)?[\s.)\-:＃]*/u, "");

  // Leading @ mentions (possibly repeated)
  s = s.replace(/^@+/, "");

  // Any remaining leading non-letters (digits, punctuation, symbols)
  s = s.replace(/^[^A-Za-z]+/, "");

  // Trailing pure junk (not part of F3 names)
  s = s.replace(/[#@*]+$/g, "");

  return s.replace(/\s+/g, " ").trim();
}

/** Canonical key for matching (cleaned + lowercased). */
export function normalizeName(name: string): string {
  return cleanPersonName(name).toLowerCase().replace(/\s+/g, " ");
}

/** Prefer the cleaner display form when merging duplicates. */
function preferDisplayName(a: string, b: string): string {
  const score = (s: string) => {
    let n = 0;
    if (/^\d/.test(s)) n -= 3;
    if (s.includes("@")) n -= 2;
    if (/[^A-Za-z0-9\s'\-]/.test(s)) n -= 1;
    n += Math.min(s.length, 40) * 0.01; // slight preference for fuller name
    return n;
  };
  return score(b) > score(a) ? b : a;
}

function dedupeCleanNames(rawNames: string[]): string[] {
  const byKey = new Map<string, string>();
  for (const raw of rawNames) {
    const display = cleanPersonName(raw);
    if (!isUsableName(display)) continue;
    const key = normalizeName(display);
    if (!key) continue;
    const existing = byKey.get(key);
    byKey.set(key, existing ? preferDisplayName(existing, display) : display);
  }
  return [...byKey.values()];
}

/** Lightweight posts for the client stats UI (no full body text). */
export function toStatsPosts(posts: ParsedBackblast[]): StatsPost[] {
  return posts.map((p) => {
    const qicParts = dedupeCleanNames(splitPeopleField(p.qic));
    return {
      id: p.id,
      date: p.date,
      ao: p.ao,
      qic: qicParts.join(", ") || cleanPersonName(p.qic) || p.qic,
      title: p.title,
      paxRoster: dedupeCleanNames(p.paxRoster),
      fngNames: dedupeCleanNames(parseFngNames(p.fngs)),
    };
  });
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
  const cleaned = cleanPersonName(raw);
  if (!cleaned || /^tbd$/i.test(cleaned) || /^q$/i.test(cleaned)) return false;
  if (/^none$/i.test(cleaned) || /^n\/?a$/i.test(cleaned)) return false;
  // Skip unresolved Slack IDs like U01ABC...
  if (/^U[A-Z0-9]{6,}$/i.test(cleaned)) return false;
  // Must still have a letter after cleaning
  if (!/[A-Za-z]/.test(cleaned)) return false;
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
  const display = cleanPersonName(raw);
  const key = normalizeName(display);
  if (!key) return;
  const existing = byKey.get(key);
  byKey.set(key, existing ? preferDisplayName(existing, display) : display);
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

export type MonthBucket = {
  /** YYYY-MM sort key */
  key: string;
  /** e.g. "Aug 2026" */
  label: string;
  count: number;
};

/** Attendance (or any post set) totals by calendar month in Central Time. */
export function computeMonthlyTotals(posts: StatsPost[]): MonthBucket[] {
  const map = new Map<string, number>();

  for (const p of posts) {
    const ymd = postYmd(p.date);
    const key = ymd.slice(0, 7); // YYYY-MM
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => {
      const [ys, ms] = key.split("-");
      const label = new Date(Date.UTC(Number(ys), Number(ms) - 1, 15)).toLocaleDateString(
        "en-US",
        { month: "short", year: "numeric", timeZone: "UTC" }
      );
      return { key, label, count };
    });
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
  const name = cleanPersonName(raw);
  const key = normalizeName(name);
  if (!key) return;
  const existing = map.get(key);
  if (existing) {
    existing.count += 1;
    existing.name = preferDisplayName(existing.name, name);
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
      const display = cleanPersonName(raw);
      const key = normalizeName(display);
      if (!key) continue;
      if (first.has(key)) {
        // If we already saw them, still mark asFng if this same-day post lists FNG
        // (only update if same first date and was FNG)
        const rec = first.get(key)!;
        if (rec.firstYmd === postYmd(post.date) && asFng) {
          rec.asFng = true;
        }
        rec.name = preferDisplayName(rec.name, display);
        continue;
      }
      first.set(key, {
        name: display,
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
