/** Shared domain types for F3 Lincoln (PRD §5). */

export type AoStyle =
  | "Bootcamp"
  | "Run"
  | "Ruck"
  | "Weights"
  | "Murph"
  | "Mixed"
  | "Other";

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type AreaOfOperation = {
  id: string;
  name: string;
  address: string;
  mapUrl: string;
  days: DayOfWeek[];
  time: string;
  /** Primary style label shown in the table badge */
  style: AoStyle;
  /** Optional day-by-day style notes (e.g. Mon/Wed bootcamp, Fri Muscle Beach) */
  styleByDay?: Partial<Record<DayOfWeek, string>>;
  description?: string;
  /** Optional early option (e.g. pre-run) before the main beatdown */
  preRun?: {
    time: string;
    days: DayOfWeek[];
    notes?: string;
  };
  siteQ?: string[];
};

export type LeadershipRole =
  | "Nantan"
  | "Weasel Shaker"
  | "Site Q"
  | "1st F Q"
  | "2nd F Q"
  | "3rd F Q"
  | "Comms Q"
  | "Other";

export type Leader = {
  f3Name: string;
  role: LeadershipRole | string;
  description: string;
  photoUrl?: string;
  ao?: string;
};

/** Pre-blast: upcoming workout announcement */
export type Preblast = {
  id: string;
  kind: "preblast";
  title: string;
  date: string; // ISO
  ao: string;
  qic: string;
  theme: string;
  playlistUrl?: string;
  summary?: string;
};

/** Backblast: post-workout summary */
export type Backblast = {
  id: string;
  kind: "backblast";
  title: string;
  date: string; // ISO
  ao: string;
  qic: string;
  theme: string;
  playlistUrl?: string;
  paxCount: number;
  paxRoster: string[];
  fngCount: number;
  warmARama: string;
  theThang: string;
  cot: string;
};
