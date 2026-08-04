import type { Backblast, Preblast } from "@/lib/types";

/** Sample / seed posts — replace with CMS or MDX as the region publishes. */
export const preblasts: Preblast[] = [
  {
    id: "pre-2026-08-09",
    kind: "preblast",
    title: "Saturday Flag — First Call",
    date: "2026-08-09T06:00:00-05:00",
    ao: "Example AO — Saturday",
    qic: "TBD",
    theme: "Back to Basics Beatdown",
    playlistUrl: "",
    summary:
      "Bring gloves and a coupon if you have one. FNGs: just show up — we’ll take care of the rest.",
  },
];

export const backblasts: Backblast[] = [
  {
    id: "bb-2026-08-01",
    kind: "backblast",
    title: "Gloom Opener",
    date: "2026-08-01T05:30:00-05:00",
    ao: "Example AO — Bootcamp",
    qic: "TBD",
    theme: "Full-body classic",
    playlistUrl: "",
    paxCount: 8,
    paxRoster: ["TBD", "FNG-1", "FNG-2"],
    fngCount: 2,
    warmARama:
      "SSH x20 IC, Windmills x10 IC, Imperial Walkers x15 IC, Arm Circles, Merkins x10.",
    theThang:
      "Mosey to the lot. 4 corners: 10 burpees, 20 squats, 30 LBCs, 40 SSH. Rinse and repeat. Mary to finish.",
    cot: "Welcome FNGs. Announce Slack. Prayers for families. Aye!",
  },
  {
    id: "bb-2026-07-28",
    kind: "backblast",
    title: "Coupon Carry",
    date: "2026-07-28T05:30:00-05:00",
    ao: "Example AO — Bootcamp",
    qic: "TBD",
    theme: "Heavy metal",
    paxCount: 6,
    paxRoster: ["TBD"],
    fngCount: 0,
    warmARama: "Dynamic stretch + short mosey.",
    theThang: "Coupon complex: curls, presses, thrusters, farmer carries. Partner work. No man left behind.",
    cot: "Site Q reminders. Upcoming CSAUP chatter. Count-o-rama, name-o-rama, BOM.",
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
