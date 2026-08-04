/**
 * Site-wide config for F3 Lincoln.
 * Update these values as the region evolves.
 */

export const site = {
  name: "F3 Lincoln",
  tagline: "Fitness, Fellowship, Faith",
  mission:
    "To plant, grow, and serve small workout groups for men for the invigoration of male community leadership.",
  city: "Lincoln, Nebraska",
  region: "F3 Lincoln",
  // Update when you have real links
  slackUrl: "",
  facebookUrl: "",
  email: "",
} as const;

export type WorkoutAo = {
  name: string;
  day: string;
  time: string;
  location: string;
  style: string;
  notes?: string;
};

/** Placeholder AOs — replace with real Lincoln workout locations. */
export const workouts: WorkoutAo[] = [
  {
    name: "Example AO",
    day: "Monday / Wednesday / Friday",
    time: "5:30 AM",
    location: "TBD — park or parking lot in Lincoln",
    style: "Bootcamp",
    notes: "Replace this with your real AO list.",
  },
];
