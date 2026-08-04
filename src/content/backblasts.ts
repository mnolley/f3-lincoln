import type { Backblast, Preblast } from "@/lib/types";

/** Sample / seed posts — replace with CMS or MDX as the region publishes. */
export const preblasts: Preblast[] = [
  {
    id: "pre-2026-08-08",
    kind: "preblast",
    title: "Friday Muscle Beach",
    date: "2026-08-08T05:30:00-05:00",
    ao: "Sparta",
    qic: "TBD",
    theme: "Muscle Beach — strength focus",
    playlistUrl: "",
    summary:
      "Main flag at 5:30 AM. Optional pre-run often rolls at 5:00. Friday is usually less cardio — Q may audible. FNGs: just show up.",
  },
];

export const backblasts: Backblast[] = [
  {
    id: "bb-2026-08-01",
    kind: "backblast",
    title: "Gloom Opener at Sparta",
    date: "2026-08-01T05:30:00-05:00",
    ao: "Sparta",
    qic: "TBD",
    theme: "Bootcamp classic",
    playlistUrl: "",
    paxCount: 8,
    paxRoster: ["TBD", "FNG-1", "FNG-2"],
    fngCount: 2,
    warmARama:
      "SSH x20 IC, Windmills x10 IC, Imperial Walkers x15 IC, Arm Circles, Merkins x10.",
    theThang:
      "Mosey around the lot. 4 corners: 10 burpees, 20 squats, 30 LBCs, 40 SSH. Rinse and repeat. Mary to finish.",
    cot: "Welcome FNGs. Announce Slack. Prayers for families. Aye!",
  },
  {
    id: "bb-2026-07-25",
    kind: "backblast",
    title: "Muscle Beach Friday",
    date: "2026-07-25T05:30:00-05:00",
    ao: "Sparta",
    qic: "TBD",
    theme: "Muscle Beach",
    paxCount: 6,
    paxRoster: ["TBD"],
    fngCount: 0,
    warmARama: "Dynamic stretch + short mosey. Pre-runners already had their miles.",
    theThang:
      "Strength-focused stations: coupons, merkins, squats, carries. Less pure cardio — still a beatdown. Q’s call.",
    cot: "Site Q reminders. Count-o-rama, name-o-rama, BOM.",
  },
];

export function getAllPosts(): Array<Backblast | Preblast> {
  return [...preblasts, ...backblasts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBackblastById(id: string): Backblast | undefined {
  return backblasts.find((b) => b.id === id);
}

export function getPreblastById(id: string): Preblast | undefined {
  return preblasts.find((p) => p.id === id);
}
