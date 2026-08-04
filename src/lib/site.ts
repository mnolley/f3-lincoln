export const site = {
  name: "F3 Lincoln",
  domain: "f3lincoln.com",
  tagline: "Fitness · Fellowship · Faith",
  city: "Lincoln, Nebraska",
  mission:
    "To plant, grow, and serve small workout groups for men for the invigoration of male community leadership.",
  motto: "Leave no man behind, but leave no man where you find him.",
  // Update when region channels are ready
  slackUrl: "",
  slackLabel: "Join F3 Lincoln on Slack",
  mapUrl: "https://map.f3nation.com/?lat=40.8258&lon=-96.6852&zoom=11",
  nationUrl: "https://f3nation.com/",
  nationStartUrl: "https://f3nation.com/start-here",
  disclaimerUrl: "https://f3nation.com/legal/disclaimer-and-notice/",
  trademarksUrl: "https://f3nation.com/use-of-f3-trademarks/",
  email: "",
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/new", label: "New Here" },
  { href: "/locations", label: "Locations" },
  { href: "/leadership", label: "Leadership" },
  { href: "/backblasts", label: "Backblasts" },
] as const;

export const threeFs = [
  {
    title: "Fitness",
    body: "Peer-led bootcamp-style beatdowns outdoors. All fitness levels. You versus you — we keep the pack together.",
  },
  {
    title: "Fellowship",
    body: "The real reason men keep posting. Bonds forged in the Gloom, sealed in the Circle of Trust, and lived out beyond the flag.",
  },
  {
    title: "Faith",
    body: "Belief in something larger than yourself — God, family, or the man beside you. Not a church, not a denomination. Open to all men.",
  },
] as const;

export const fiveCorePrinciples = [
  {
    title: "Free of Charge",
    body: "Never a fee to attend a workout. Ever.",
    icon: "/brand/F3_Free.png",
  },
  {
    title: "Open to All Men",
    body: "No matter the man, you are welcome here.",
    icon: "/brand/F3_Opentoall.png",
  },
  {
    title: "Held Outdoors",
    body: "Rain or shine, hot or cold — we are out there.",
    icon: "/brand/F3_RainShine.png",
  },
  {
    title: "Peer Led",
    body: "Men lead men in a rotating fashion. No certification required.",
    icon: "/brand/F3_PeerLed.png",
  },
  {
    title: "Ends with a COT",
    body: "Every workout ends with a Circle of Trust.",
    icon: "/brand/F3_COT.png",
  },
] as const;

/** Role definitions — these are administrative people, not workout styles. */
export const roleDefinitions: Record<string, string> = {
  Nantan: "Regional leader. Owns the overall health, growth, and culture of F3 Lincoln.",
  "Weasel Shaker":
    "Right hand to the Nantan. Helps drive communication, momentum, and day-to-day regional ops.",
  "Site Q":
    "Owner of a specific AO (Area of Operation). Keeps the site planted, welcomes FNGs, and shepherds the local pack.",
  "1st F Q": "Focuses on the Fitness arm — workouts, AO health, and Q development.",
  "2nd F Q": "Focuses on Fellowship — social events, CSAUPs, and connecting the PAX off the asphalt.",
  "3rd F Q": "Focuses on Faith — third-F opportunities and deeper purpose beyond the beatdown.",
  "Comms Q": "Keeps the region informed — Slack, socials, and the website.",
};
