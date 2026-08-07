import { workoutStartIso } from "@/lib/format";
import type { SlackMessage } from "./types";
import { resolveUserName, type UserDirectory } from "./users";

export type ParsedPreblast = {
  id: string;
  ts: string;
  title: string;
  date: string;
  ymd: string;
  ao: string;
  qic: string;
  theme?: string;
  rawText: string;
  username?: string;
};

let activeDirectory: UserDirectory = new Map();

export function withPreblastDirectory<T>(
  directory: UserDirectory,
  fn: () => T
): T {
  const prev = activeDirectory;
  activeDirectory = directory;
  try {
    return fn();
  } finally {
    activeDirectory = prev;
  }
}

/** True if this Slack message looks like a Paxminer / Slackblast preblast. */
export function isPaxminerPreblast(message: SlackMessage): boolean {
  if (message.metadata?.event_type === "preblast") return true;

  const header = extractHeaderMarkdown(message);
  if (header && /^\*?Pre-?blast!?/i.test(header.trim())) return true;

  if (message.bot_id || message.subtype === "bot_message") {
    const blob = `${header ?? ""}\n${message.text ?? ""}`;
    if (
      /^\*?Pre-?blast!?/im.test(blob) ||
      (/\*AO\*/i.test(blob) &&
        /\*DATE\*/i.test(blob) &&
        (/\*Q\*/i.test(blob) || /\*QIC\*/i.test(blob)) &&
        !/\*PAX\*/i.test(blob) &&
        !/\*COUNT\*/i.test(blob))
    ) {
      return true;
    }
  }

  return false;
}

function extractHeaderMarkdown(message: SlackMessage): string | null {
  const section = message.blocks?.find(
    (b) => b.type === "section" && b.text?.type === "mrkdwn" && b.text.text
  );
  return section?.text?.text ?? null;
}

function fieldValue(header: string, label: string): string {
  const re = new RegExp(`\\*${label}\\*?\\s*:\\s*([^\\n*]+)`, "i");
  const m = header.match(re);
  return m?.[1]?.trim() ?? "";
}

function extractUserIds(text: string): string[] {
  const ids: string[] = [];
  const re = /<@([A-Z0-9]+)>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    ids.push(m[1]);
  }
  return ids;
}

function mrkdwnToPlain(text: string): string {
  return text
    .replace(/<@([A-Z0-9]+)>/g, (_, id: string) =>
      resolveUserName(id, activeDirectory)
    )
    .replace(/<([^|>]+)\|([^>]+)>/g, "$2")
    .replace(/<([^>]+)>/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

/**
 * Loose line patterns often posted in #q-schedule, e.g.:
 * "Mon 8/11 — Gandalf" or "2026-08-11 Sparta Q: Not Jake"
 */
export function parseScheduleLine(
  text: string,
  directory: UserDirectory
): ParsedPreblast | null {
  const plain = mrkdwnToPlain(text).replace(/\s+/g, " ").trim();
  if (!plain || plain.length < 6) return null;

  // ISO date
  let ymd = plain.match(/\b(20\d{2}-\d{2}-\d{2})\b/)?.[1];

  // M/D/YY or M/D/YYYY
  if (!ymd) {
    const mdy = plain.match(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/);
    if (mdy) {
      const month = mdy[1].padStart(2, "0");
      const day = mdy[2].padStart(2, "0");
      let year = Number(mdy[3]);
      if (year < 100) year += 2000;
      ymd = `${year}-${month}-${day}`;
    }
  }

  if (!ymd) return null;

  // Q after "Q:" or em-dash / hyphen name
  let qic = "";
  const qField = plain.match(/\bQ(?:IC)?\s*[:\-–—]\s*(.+)$/i)?.[1]?.trim();
  if (qField && !/^open|tbd|none|vacant|\?+$/i.test(qField)) {
    qic = qField.replace(/\s*\(via F3 Nation\)\s*/i, "").trim();
  } else {
    // "Mon 8/11 - Gandalf" style
    const dashName = plain.match(/[-–—]\s*([A-Za-z][A-Za-z0-9 .']{1,40})\s*$/);
    if (dashName && !/open|tbd/i.test(dashName[1])) {
      qic = dashName[1].trim();
    }
  }

  // Resolve any leftover <@U…> in qic via directory
  for (const id of extractUserIds(text)) {
    const name = resolveUserName(id, directory);
    if (name && !qic) qic = name;
  }

  const aoMatch = plain.match(/\bAO\s*[:\-–—]\s*([A-Za-z0-9 ]+)/i);
  const ao = aoMatch?.[1]?.trim() || "Sparta";

  return {
    id: `line-${ymd}-${ao}`,
    ts: "",
    title: plain.slice(0, 80),
    date: workoutStartIso(ymd),
    ymd,
    ao,
    qic,
    rawText: plain,
  };
}

export function parsePreblastMessage(
  message: SlackMessage
): ParsedPreblast | null {
  if (!isPaxminerPreblast(message)) {
    // Try loose schedule lines for non-bot human posts
    if (message.text && !message.bot_id) {
      return null; // handled separately with directory
    }
    return null;
  }

  const header = extractHeaderMarkdown(message) ?? message.text ?? "";
  const headerPlain = mrkdwnToPlain(header);

  const titleLine =
    header
      .split("\n")[0]
      ?.replace(/^\*|\*$/g, "")
      .replace(/^Pre-?blast!\s*/i, "")
      .trim() || "Preblast";

  const dateField = fieldValue(header, "DATE");
  const ao = fieldValue(header, "AO") || "Sparta";
  const qField = fieldValue(header, "Q") || fieldValue(header, "QIC");
  const qIds = extractUserIds(qField);

  const ymd =
    dateField.trim().match(/^\d{4}-\d{2}-\d{2}$/)?.[0] ||
    dateField.trim().match(/(\d{4}-\d{2}-\d{2})/)?.[1];

  if (!ymd) return null;

  const qicFromIds = qIds.map((id) => resolveUserName(id, activeDirectory));
  const qicFromUsername = message.username
    ?.replace(/\s*\(via F3 Nation\)\s*/i, "")
    .trim();
  const qic =
    (qIds[0] && activeDirectory.get(qIds[0])) ||
    qicFromIds.filter(Boolean).join(", ") ||
    mrkdwnToPlain(qField).replace(/^[,;\s]+|[,;\s]+$/g, "") ||
    qicFromUsername ||
    "";

  const cleanQ =
    !qic || /^open|tbd|none|vacant|\?+$/i.test(qic.trim()) ? "" : qic.trim();

  return {
    id: message.ts.replace(".", ""),
    ts: message.ts,
    title: titleLine,
    date: workoutStartIso(ymd),
    ymd,
    ao: mrkdwnToPlain(ao),
    qic: cleanQ,
    theme: titleLine,
    rawText: headerPlain,
    username: message.username,
  };
}
