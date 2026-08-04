import type { AreaOfOperation } from "@/lib/types";

/**
 * Lincoln AO directory — currently a single flag: Sparta.
 */
export const aos: AreaOfOperation[] = [
  {
    id: "sparta",
    name: "Sparta",
    address: "Lincoln, NE — see map for exact meet point",
    mapUrl: "https://maps.app.goo.gl/Evet3HCDQ4s64fbaA",
    days: ["Monday", "Wednesday", "Friday"],
    time: "5:30–6:15 AM",
    style: "Mixed",
    styleByDay: {
      Monday: "Bootcamp",
      Wednesday: "Bootcamp",
      Friday: "Muscle Beach (less cardio)",
    },
    preRun: {
      time: "5:00 AM",
      days: ["Monday", "Wednesday", "Friday"],
      notes:
        "A group often meets at 5:00 AM for a pre-run before the main beatdown. Join if you want extra miles — otherwise show for 5:30.",
    },
    description:
      "F3 Lincoln’s home AO. Monday and Wednesday are bootcamp-style. Friday is usually Muscle Beach — more strength, less cardio — though the Q is free to audible anytime. Main workout 5:30–6:15 AM. Optional pre-run often gathers at 5:00 AM.",
    siteQ: ["TBD"],
  },
];

export const aoNames = aos.map((ao) => ao.name);
