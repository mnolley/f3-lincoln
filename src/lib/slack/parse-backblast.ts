import { workoutStartIso } from "@/lib/format";
import type { SlackBlock, SlackMessage } from "./types";
import { resolveUserName, type UserDirectory } from "./users";

export type ParsedBackblast = {
  id: string;
  ts: string;
  title: string;
  date: string;
  ao: string;
  qic: string;
  paxRoster: string[];
  paxCount: number;
  fngCount: number;
  fngs: string;
  warmARama: string;
  theThang: string;
  cot: string;
  body: string;
  rawText: string;
  username?: string;
};

/** Thread-local directory used while parsing one fetch batch. */
let activeDirectory: UserDirectory = new Map();

export function withUserDirectory<T>(
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

/** True if this Slack message is a Paxminer / Slackblast-style backblast. */
export function isPaxminerBackblast(message: SlackMessage): boolean {
  if (message.metadata?.event_type === "backblast") return true;

  const header = extractHeaderMarkdown(message);
  if (header && /^\*?Backblast!?/i.test(header.trim())) return true;

  // Bot posts with structured AO / Q / COUNT fields
  if (message.bot_id || message.subtype === "bot_message") {
    const blob = `${header ?? ""}\n${message.text ?? ""}`;
    if (
      /\*AO\*/i.test(blob) &&
      (/\*Q\*/i.test(blob) || /\*QIC\*/i.test(blob)) &&
      (/\*COUNT\*/i.test(blob) || /\*PAX\*/i.test(blob))
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

/** Flatten rich_text (and similar) blocks into plain text. */
export function blocksToPlainText(blocks: SlackBlock[] | undefined): string {
  if (!blocks?.length) return "";

  const parts: string[] = [];

  for (const block of blocks) {
    if (block.type === "section" && block.text?.text) {
      // Skip the metadata header section — handled separately
      if (/^\*?Backblast!?/i.test(block.text.text.trim())) continue;
      parts.push(mrkdwnToPlain(block.text.text));
      continue;
    }

    if (block.type === "rich_text" && Array.isArray(block.elements)) {
      parts.push(richTextElementsToPlain(block.elements));
      continue;
    }

    if (block.type === "divider") {
      parts.push("");
    }
  }

  return parts.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function richTextElementsToPlain(elements: unknown[]): string {
  const lines: string[] = [];

  for (const el of elements) {
    if (!el || typeof el !== "object") continue;
    const node = el as Record<string, unknown>;

    if (node.type === "rich_text_section" && Array.isArray(node.elements)) {
      lines.push(inlineElementsToPlain(node.elements));
    } else if (node.type === "rich_text_list" && Array.isArray(node.elements)) {
      const style = node.style === "ordered" ? "ordered" : "bullet";
      let i = 1;
      for (const item of node.elements) {
        if (!item || typeof item !== "object") continue;
        const itemNode = item as Record<string, unknown>;
        const text = Array.isArray(itemNode.elements)
          ? inlineElementsToPlain(itemNode.elements)
          : "";
        lines.push(style === "ordered" ? `${i}. ${text}` : `• ${text}`);
        i += 1;
      }
    } else if (node.type === "rich_text_preformatted" && Array.isArray(node.elements)) {
      lines.push(inlineElementsToPlain(node.elements));
    } else if (node.type === "rich_text_quote" && Array.isArray(node.elements)) {
      lines.push(
        inlineElementsToPlain(node.elements)
          .split("\n")
          .map((l) => `> ${l}`)
          .join("\n")
      );
    }
  }

  return lines.join("\n");
}

function inlineElementsToPlain(elements: unknown[]): string {
  return elements
    .map((el) => {
      if (!el || typeof el !== "object") return "";
      const node = el as Record<string, unknown>;
      if (node.type === "text" && typeof node.text === "string") return node.text;
      if (node.type === "link" && typeof node.url === "string") {
        return typeof node.text === "string" ? node.text : node.url;
      }
      if (node.type === "user" && typeof node.user_id === "string") {
        return formatUserMention(node.user_id);
      }
      if (node.type === "emoji" && typeof node.name === "string") {
        return `:${node.name}:`;
      }
      if (node.type === "broadcast" && typeof node.range === "string") {
        return `@${node.range}`;
      }
      return "";
    })
    .join("");
}

function mrkdwnToPlain(text: string): string {
  return text
    .replace(/<@([A-Z0-9]+)>/g, (_, id: string) => formatUserMention(id))
    .replace(/<([^|>]+)\|([^>]+)>/g, "$2")
    .replace(/<([^>]+)>/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

function formatUserMention(userId: string): string {
  return resolveUserName(userId, activeDirectory);
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

function splitBodySections(body: string): {
  warmARama: string;
  theThang: string;
  cot: string;
} {
  const normalized = body.replace(/\r\n/g, "\n");

  const sectionSplit =
    /(?:^|\n)\s*(WARM-?A-?RAMA|WARMUP|THE THANG|6MOM|MARY|COT|COUNT-O-RAMA|BOM)\b[:\s-]*/gi;

  const indices: { name: string; start: number; headerEnd: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = sectionSplit.exec(normalized))) {
    indices.push({
      name: match[1].toUpperCase().replace(/-/g, ""),
      start: match.index,
      headerEnd: match.index + match[0].length,
    });
  }

  const getSection = (...names: string[]) => {
    const hit = indices.find((s) => names.includes(s.name.replace(/\s/g, "")));
    if (!hit) return "";
    const idx = indices.indexOf(hit);
    const end = idx + 1 < indices.length ? indices[idx + 1].start : normalized.length;
    return normalized.slice(hit.headerEnd, end).trim();
  };

  const warm =
    getSection("WARMARAMA", "WARMUP") ||
    (indices.length === 0 ? "" : "");

  const thang = getSection("THETHANG", "THE THANG".replace(/\s/g, ""));
  // Fix: THE THANG becomes THETHANG after replace
  const theThang =
    getSection("THETHANG") ||
    (() => {
      const hit = indices.find((s) => s.name.includes("THANG"));
      if (!hit) return "";
      const idx = indices.indexOf(hit);
      const end = idx + 1 < indices.length ? indices[idx + 1].start : normalized.length;
      return normalized.slice(hit.headerEnd, end).trim();
    })();

  const cotParts = [
    getSection("COT"),
    getSection("6MOM", "MARY"),
    getSection("COUNTOORAMA", "COUNTORAMA"),
    getSection("BOM"),
  ].filter(Boolean);

  // Broader warm extraction
  const warmARama =
    warm ||
    (() => {
      const hit = indices.find(
        (s) => s.name.includes("WARM") || s.name === "WARMUP" || s.name === "WARMARAMA"
      );
      if (!hit) return "";
      const idx = indices.indexOf(hit);
      const end = idx + 1 < indices.length ? indices[idx + 1].start : normalized.length;
      return normalized.slice(hit.headerEnd, end).trim();
    })();

  return {
    warmARama,
    theThang,
    cot: cotParts.join("\n\n") || "",
  };
}

export function parseBackblastMessage(message: SlackMessage): ParsedBackblast | null {
  if (!isPaxminerBackblast(message)) return null;

  const header = extractHeaderMarkdown(message) ?? "";
  const headerPlain = mrkdwnToPlain(header);
  const bodyFromBlocks = blocksToPlainText(message.blocks);
  const rawText = message.text ?? "";
  const body = bodyFromBlocks || mrkdwnToPlain(rawText);

  // Title: first line like Backblast! Sparta "Deep Waters"
  const titleLine =
    header
      .split("\n")[0]
      ?.replace(/^\*|\*$/g, "")
      .replace(/^Backblast!\s*/i, "")
      .trim() || "Backblast";

  const dateField = fieldValue(header, "DATE");
  const ao = fieldValue(header, "AO") || "Sparta";
  const qField = fieldValue(header, "Q") || fieldValue(header, "QIC");
  const countField = fieldValue(header, "COUNT");
  const fngField = fieldValue(header, "FNGs") || fieldValue(header, "FNG");
  const paxField = header.match(/\*PAX\*:\s*([\s\S]*?)(?=\*FNGs?\*|\*COUNT\*|$)/i)?.[1] ?? "";

  const paxIds = extractUserIds(paxField);
  const qIds = extractUserIds(qField);
  const fngIds = extractUserIds(fngField);

  const paxCount = countField
    ? Number.parseInt(countField, 10) || paxIds.length
    : paxIds.length;

  const fngCount =
    fngIds.length ||
    (fngField && !/^none$/i.test(fngField) && fngField.length > 0
      ? fngField.split(/[,\s]+/).filter(Boolean).length
      : 0);

  // Workout "When" = DATE from Paxminer at 5:30 AM Central (not Slack post time)
  const tsMs = Number.parseFloat(message.ts) * 1000;
  let dateIso: string;
  const ymd = dateField.trim().match(/^\d{4}-\d{2}-\d{2}$/)?.[0];
  if (ymd) {
    dateIso = workoutStartIso(ymd);
  } else {
    // Fall back to post day in Central, still at 5:30 AM
    const postYmd = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(tsMs)); // en-CA → YYYY-MM-DD
    dateIso = workoutStartIso(postYmd);
  }

  const sections = splitBodySections(body);

  // QIC: prefer resolved F3 name, then Paxminer username, then Q mentions
  const qicFromIds = qIds.map(formatUserMention).join(", ");
  const qicFromUsername = message.username
    ?.replace(/\s*\(via F3 Nation\)\s*/i, "")
    .trim();
  const qic =
    (qIds[0] && activeDirectory.get(qIds[0])) ||
    qicFromUsername ||
    qicFromIds ||
    mrkdwnToPlain(qField) ||
    "Q";

  const id = message.ts.replace(".", "");

  // Dedupe roster while preserving order
  const seen = new Set<string>();
  const paxRoster = paxIds
    .map(formatUserMention)
    .filter((name) => {
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  const fngsResolved = fngIds.length
    ? fngIds.map(formatUserMention).join(", ")
    : mrkdwnToPlain(fngField);

  return {
    id,
    ts: message.ts,
    title: titleLine || `${ao} Backblast`,
    date: dateIso,
    ao: mrkdwnToPlain(ao),
    qic,
    paxRoster,
    paxCount: Number.isFinite(paxCount) ? paxCount : 0,
    fngCount,
    fngs: fngsResolved,
    warmARama: sections.warmARama,
    theThang: sections.theThang,
    cot: sections.cot,
    body,
    rawText: headerPlain + (body ? `\n\n${body}` : ""),
    username: message.username,
  };
}
