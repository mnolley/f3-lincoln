import { aos } from "@/content/aos";
import {
  SITE_TIMEZONE,
  WORKOUT_START_HOUR,
  WORKOUT_START_LABEL,
  WORKOUT_START_MINUTE,
  workoutStartIso,
} from "@/lib/format";
import type { AreaOfOperation, DayOfWeek } from "@/lib/types";

export type UpcomingBeatdown = {
  /** YYYY-MM-DD in America/Chicago */
  ymd: string;
  /** ISO timestamp at workout start */
  date: string;
  ao: string;
  aoId: string;
  /** e.g. "5:30 AM" or "5:30–6:15 AM" */
  time: string;
  /** Bootcamp / Muscle Beach / etc. */
  style: string;
  dayOfWeek: DayOfWeek;
  mapUrl: string;
  address: string;
  /** F3 name or empty when open */
  qic: string;
  /** Preblast title if one was found in Slack */
  title?: string;
  /** Optional pre-run note */
  preRun?: string;
  source: "schedule" | "preblast" | "merged";
};

/** Today as YYYY-MM-DD in site timezone. */
export function todayYmd(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Day-of-week name for a YYYY-MM-DD calendar date (Central). */
export function dayOfWeekForYmd(ymd: string): DayOfWeek {
  // Noon UTC on that calendar day is stable enough for DOW labels
  const [y, m, d] = ymd.split("-").map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d, 17, 0, 0)); // ~noon Central-ish
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TIMEZONE,
    weekday: "long",
  }).format(probe) as DayOfWeek;
  return name;
}

/**
 * Next `count` scheduled beatdowns from AO definitions (Mon/Wed/Fri etc.),
 * starting from today (or the next workout if today's already started).
 */
export function computeUpcomingFromAos(
  count = 3,
  now = new Date()
): UpcomingBeatdown[] {
  const results: UpcomingBeatdown[] = [];
  if (!aos.length) return results;

  // Expand each AO's days into candidate slots walking forward day by day
  const startYmd = todayYmd(now);
  const [sy, sm, sd] = startYmd.split("-").map(Number);

  // Walk up to ~8 weeks of calendar days
  for (let offset = 0; offset < 60 && results.length < count; offset++) {
    const dt = new Date(Date.UTC(sy, sm - 1, sd + offset, 12, 0, 0));
    const ymd = new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(dt);

    const dow = dayOfWeekForYmd(ymd);

    for (const ao of aos) {
      if (!ao.days.includes(dow)) continue;

      // Skip today if the workout start has already passed in Central Time
      if (ymd === startYmd && workoutAlreadyStarted(now)) {
        continue;
      }

      results.push(slotFromAo(ao, ymd, dow));
      if (results.length >= count) break;
    }
  }

  return results;
}

function workoutAlreadyStarted(now: Date): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const nowMins = hour * 60 + minute;
  const startMins = WORKOUT_START_HOUR * 60 + WORKOUT_START_MINUTE;
  // Treat as past once the main beatdown window has started
  return nowMins >= startMins;
}

function slotFromAo(
  ao: AreaOfOperation,
  ymd: string,
  dow: DayOfWeek
): UpcomingBeatdown {
  return {
    ymd,
    date: workoutStartIso(ymd),
    ao: ao.name,
    aoId: ao.id,
    time: ao.time || WORKOUT_START_LABEL,
    style: ao.styleByDay?.[dow] ?? ao.style,
    dayOfWeek: dow,
    mapUrl: ao.mapUrl,
    address: ao.address,
    qic: "",
    preRun: ao.preRun
      ? `${ao.preRun.time}${ao.preRun.notes ? ` — ${ao.preRun.notes}` : ""}`
      : undefined,
    source: "schedule",
  };
}

/** Format a long when label, e.g. "Monday, Aug 10, 2026 · 5:30–6:15 AM". */
export function formatUpcomingWhen(slot: UpcomingBeatdown): string {
  const datePart = new Date(slot.date).toLocaleDateString("en-US", {
    timeZone: SITE_TIMEZONE,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${datePart} · ${slot.time}`;
}
