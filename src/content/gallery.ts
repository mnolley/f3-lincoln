/**
 * PAX photo gallery — stills from @F3Lincoln on X.
 *
 * Inclusion rules (real photos only):
 * - Must be `photo` media from workout posts (not video frames)
 * - Phone/camera group shots of HIMs / AOs — not logos, banners, or AI art
 * - Source posts mention beatdowns / #F3Sparta / pack posts
 *
 * AI / graphic assets (X header art, logos, generated posters) are excluded.
 */
export type GalleryPhoto = {
  src: string;
  alt: string;
  /** Short caption from the X post */
  caption: string;
  /** ISO date of the post when known */
  postedAt?: string;
  sourceUrl?: string;
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    src: "/images/gallery/01-coupon-club.jpg",
    alt: "HIMs after Lonely Coupon Club at Sparta",
    caption: "Lonely Coupon Club — The Ocho VQ",
    postedAt: "2026-08-06",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/05-muscle-beach.jpg",
    alt: "Partner Muscle Beach at Sparta",
    caption: "Muscle Beach — iron sharpens iron",
    postedAt: "2026-07-31",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/03-recess.jpg",
    alt: "Pack after Recess is Over at Sparta",
    caption: "Recess is over — playground + Taygetus",
    postedAt: "2026-08-02",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/10-poker.jpg",
    alt: "Poker beatdown crew at Sparta",
    caption: "Poker Beatdown with Red — welcome Treadstone",
    postedAt: "2026-07-31",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/06-vacation.jpg",
    alt: "F3 Vacation themed beatdown at Sparta",
    caption: "F3 Vacation — four corners with Julia Childz",
    postedAt: "2026-07-31",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/07-man-my-son.jpg",
    alt: "Circle after 11s at Sparta",
    caption: "You’ll be a Man, my son — 11s with coupons",
    postedAt: "2026-07-31",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/08-eleven.jpg",
    alt: "HIMs mid-beatdown at Sparta",
    caption: "11s — no shortcuts, no ego",
    postedAt: "2026-07-31",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/04-forward-progress.jpg",
    alt: "Forward Progress AMRAP crew",
    caption: "Forward Progress — LTB grinder",
    postedAt: "2026-07-31",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/09-controlled-chaos.jpg",
    alt: "Controlled Chaos beatdown at Sparta",
    caption: "Controlled Chaos — EMOMs and blockees",
    postedAt: "2026-07-31",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/02-deep-waters.jpg",
    alt: "Deep Waters beatdown pack",
    caption: "Deep Waters — Leeroy Jenkins sprints",
    postedAt: "2026-08-03",
    sourceUrl: "https://x.com/F3Lincoln",
  },
  {
    src: "/images/gallery/11-whoopi.jpg",
    alt: "Pack with down-ranger Whoopi at Sparta",
    caption: "Downrange Q Whoopi — Indian Run & 7 of Diamonds",
    postedAt: "2026-07-10",
    sourceUrl: "https://x.com/F3Lincoln",
  },
];
