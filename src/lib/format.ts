/** Lincoln / F3 Central Time */
export const SITE_TIMEZONE = "America/Chicago";

/** Standard Sparta beatdown start */
export const WORKOUT_START_HOUR = 5;
export const WORKOUT_START_MINUTE = 30;
export const WORKOUT_START_LABEL = "5:30 AM";

/**
 * Build an ISO timestamp for a calendar date at workout start (5:30 AM Central).
 * `ymd` is YYYY-MM-DD from Paxminer *DATE* field.
 */
export function workoutStartIso(ymd: string): string {
  const match = ymd.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return new Date().toISOString();
  }

  const [, ys, ms, ds] = match;
  const year = Number(ys);
  const month = Number(ms);
  const day = Number(ds);

  // Find the UTC instant whose America/Chicago clock shows ymd 05:30
  // Start with a UTC guess near Central Time, then correct.
  let utcMs = Date.UTC(year, month - 1, day, WORKOUT_START_HOUR + 6, WORKOUT_START_MINUTE, 0);

  for (let i = 0; i < 8; i++) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: SITE_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(utcMs));

    const get = (type: string) =>
      Number(parts.find((p) => p.type === type)?.value ?? NaN);

    const cy = get("year");
    const cm = get("month");
    const cd = get("day");
    let ch = get("hour");
    const cmin = get("minute");
    // hourCycle h23 can yield 24 for midnight in some engines
    if (ch === 24) ch = 0;

    if (
      cy === year &&
      cm === month &&
      cd === day &&
      ch === WORKOUT_START_HOUR &&
      cmin === WORKOUT_START_MINUTE
    ) {
      return new Date(utcMs).toISOString();
    }

    const actualDay = Date.UTC(cy, cm - 1, cd);
    const targetDay = Date.UTC(year, month - 1, day);
    const dayDeltaMin = (targetDay - actualDay) / 60000;
    const timeDeltaMin =
      WORKOUT_START_HOUR * 60 +
      WORKOUT_START_MINUTE -
      (ch * 60 + cmin);

    utcMs += (dayDeltaMin + timeDeltaMin) * 60 * 1000;
  }

  return new Date(utcMs).toISOString();
}

/** Full when string for a beatdown: e.g. "Mon, Aug 3, 2026 · 5:30 AM" */
export function formatWorkoutWhen(iso: string) {
  const datePart = new Date(iso).toLocaleDateString("en-US", {
    timeZone: SITE_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${datePart} · ${WORKOUT_START_LABEL}`;
}

/** Date + time in Central (for non-workout timestamps if needed) */
export function formatPostDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: SITE_TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: SITE_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
