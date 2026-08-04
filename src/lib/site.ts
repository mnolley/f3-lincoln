export const site = {
  name: "F3 Lincoln",
  domain: "f3lincoln.com",
  tagline: "Fitness · Fellowship · Faith",
  city: "Lincoln, Nebraska",
  mission:
    "To plant, grow, and serve small workout groups for men for the invigoration of male community leadership.",
  motto: "Leave no man behind, but leave no man where you find him.",
  // Update when region channels are ready
  slackUrl:
    "https://join.slack.com/t/f3lincoln/shared_invite/zt-45t3jm46u-vjjeCItAh7YF3STHEYn8QA",
  slackLabel: "Join F3 Lincoln on Slack",
  mapUrl: "https://map.f3nation.com/?lat=40.8258&lon=-96.6852&zoom=11",
  nationUrl: "https://f3nation.com/",
  nationStartUrl: "https://f3nation.com/start-here",
  exiconUrl: "https://f3nation.com/exicon",
  lexiconUrl: "https://f3nation.com/lexicon",
  qSourceUrl: "https://f3nation.com/q-source",
  gearUrl: "https://f3gear.com/",
  nearMeUrl: "https://f3near.me/",
  disclaimerUrl: "https://f3nation.com/legal/disclaimer-and-notice/",
  trademarksUrl: "https://f3nation.com/use-of-f3-trademarks/",
  email: "",
  facebookUrl: "",
  instagramUrl: "",
  twitterUrl: "",
} as const;

/** Primary nav — always visible */
export const nav = [
  { href: "/", label: "Home" },
  { href: "/new", label: "New Here" },
  { href: "/locations", label: "Locations" },
  { href: "/leadership", label: "Leadership" },
  { href: "/backblasts", label: "Backblasts" },
] as const;

export type PaxLink = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

export type PaxGroup = {
  title: string;
  links: PaxLink[];
};

/**
 * Pax menu — inspired by F3 Omaha’s PAX dropdown (resources for active PAX / Qs).
 * Internal Lincoln pages + F3 Nation tools.
 */
export const paxMenu: PaxGroup[] = [
  {
    title: "Lincoln",
    links: [
      {
        label: "Sparta — Locations",
        href: "/locations",
        description: "Days, times, map, pre-run",
      },
      {
        label: "Backblasts & Pre-blasts",
        href: "/backblasts",
        description: "Workout archive and announcements",
      },
      {
        label: "Leadership",
        href: "/leadership",
        description: "Nantan, Weasel Shaker, Site Q",
      },
      {
        label: "FNG / New Here",
        href: "/new",
        description: "What to expect on your first post",
      },
      {
        label: "Pax Resources",
        href: "/pax",
        description: "Full list of tools and links",
      },
    ],
  },
  {
    title: "Tools & Lingo",
    links: [
      {
        label: "Exicon (Exercises)",
        href: site.exiconUrl,
        description: "Exercise encyclopedia",
        external: true,
      },
      {
        label: "Lexicon (Lingo)",
        href: site.lexiconUrl,
        description: "F3 terms — AO, QIC, COT, and more",
        external: true,
      },
      {
        label: "Q Source",
        href: site.qSourceUrl,
        description: "Leadership framework for HIMs",
        external: true,
      },
      {
        label: "F3 Nation Map",
        href: site.mapUrl,
        description: "Find AOs near you / Downrange",
        external: true,
      },
      {
        label: "F3Near.me",
        href: site.nearMeUrl,
        description: "Nearby workout finder",
        external: true,
      },
    ],
  },
  {
    title: "Nation & Gear",
    links: [
      {
        label: "F3 Nation",
        href: site.nationUrl,
        description: "National home",
        external: true,
      },
      {
        label: "F3 Gear",
        href: site.gearUrl,
        description: "Shirts, flags, and merch",
        external: true,
      },
      {
        label: "Disclaimer & Notice",
        href: site.disclaimerUrl,
        description: "Official F3 Nation legal notice",
        external: true,
      },
    ],
  },
];

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
