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
  }));
}

export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^@/, "");
}

/** Split multi-Q fields like "Not Jake, Gandalf" or "A & B". */
export function splitPeopleField(field: string): string[] {
  if (!field?.trim()) return [];
  return field
    .split(/\s*(?:,|&|\/|\band\b)\s*/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/^tbd$/i.test(s) && !/^q$/i.test(s));
}

export function namesMatch(a: string, b: string): boolean {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return false;
  return na === nb;
}

export function personIsQ(post: StatsPost, person: string): boolean {
  return splitPeopleField(post.qic).some((q) => namesMatch(q, person));
}

export function personAttended(post: StatsPost, person: string): boolean {
  if (post.paxRoster.some((p) => namesMatch(p, person))) return true;
  // Q is almost always present even if roster resolution missed them
  return personIsQ(post, person);
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

/** Unique PAX names from Qs + rosters, sorted A–Z. */
export function collectPaxNames(posts: StatsPost[]): string[] {
  const byKey = new Map<string, string>();

  const add = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned || /^tbd$/i.test(cleaned) || /^q$/i.test(cleaned)) return;
    // Skip unresolved Slack IDs like U01ABC...
    if (/^U[A-Z0-9]{6,}$/i.test(cleaned)) return;
    const key = normalizeName(cleaned);
    if (!key) return;
    if (!byKey.has(key)) byKey.set(key, cleaned);
  };

  for (const post of posts) {
    for (const q of splitPeopleField(post.qic)) add(q);
    for (const p of post.paxRoster) add(p);
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
