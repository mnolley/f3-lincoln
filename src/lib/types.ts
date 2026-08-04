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
  style: AoStyle;
  description?: string;
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
