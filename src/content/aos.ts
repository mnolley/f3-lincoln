import type { AreaOfOperation } from "@/lib/types";

/**
 * Lincoln AO directory.
 * Replace placeholders with real names, addresses, and Site Qs as the region confirms them.
 */
export const aos: AreaOfOperation[] = [
  {
    id: "example-bootcamp",
    name: "Example AO — Bootcamp",
    address: "TBD Park, Lincoln, NE",
    mapUrl: "https://maps.google.com/?q=Lincoln,+NE",
    days: ["Monday", "Wednesday", "Friday"],
    time: "5:30–6:15 AM",
    style: "Bootcamp",
    description:
      "Placeholder AO. Update src/content/aos.ts with real Lincoln locations, times, and Site Qs.",
    siteQ: ["TBD"],
  },
  {
    id: "example-saturday",
    name: "Example AO — Saturday",
    address: "TBD School / Park, Lincoln, NE",
    mapUrl: "https://maps.google.com/?q=Lincoln,+NE",
    days: ["Saturday"],
    time: "6:00–7:00 AM",
    style: "Bootcamp",
    description: "Typical Saturday flag-in. Coffeeteria after COT when announced in Slack.",
    siteQ: ["TBD"],
  },
  {
    id: "example-ruck",
    name: "Example AO — Ruck",
    address: "TBD Trailhead, Lincoln, NE",
    mapUrl: "https://maps.google.com/?q=Lincoln,+NE",
    days: ["Tuesday"],
    time: "5:15–6:15 AM",
    style: "Ruck",
    description: "Ruck-focused beatdown. Bring your ruck when the Q calls for it.",
    siteQ: ["TBD"],
  },
];

export const aoNames = aos.map((ao) => ao.name);
