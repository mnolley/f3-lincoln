import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SlackCta } from "@/components/SlackCta";
import { fiveCorePrinciples, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "New Here",
  description: "What to expect at your first F3 Lincoln workout. Free, outdoor, peer-led.",
};

const expect = [
  {
    title: "It starts early",
    body: "Most beatdowns launch around 5:15–5:30 AM. Get there five minutes early. You’ll come to love the Gloom.",
  },
  {
    title: "About 45 minutes",
    body: "Peer-led, bootcamp-style work. Running, merkins, squats, coupons (cinder blocks) — every Q is different.",
  },
  {
    title: "Always outside",
    body: "Parks, schools, parking lots. Rain, snow, heat, or cold. Dress for the conditions.",
  },
  {
    title: "Not a competition",
    body: "You versus you. We modify. We wait. Leave no man behind — but leave no man where you found him.",
  },
  {
    title: "Completely free",
    body: "No dues, no upsell, no gear required on day one. Just show up.",
  },
  {
    title: "Faith ≠ a church pitch",
    body: "Faith means belief in something bigger than yourself. COT may include a brief shout-out or prayer — open to all faiths and no faith.",
  },
];

export default function NewHerePage() {
  return (
    <PageShell
      eyebrow="Friendly New Guy (FNG)"
      title="New Here?"
      intro="Your buddy put the emotional headlock on you — or you found us online. Either way: you got this."
    >
      <div className="mb-10">
        <SlackCta
          label="Plug into the PAX"
          description="Join F3 Lincoln Slack for workout chatter, Pre-blasts, and community. FNGs are welcome — introduce yourself after your first post."
        />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {expect.map((item) => (
            <article key={item.title} className="card-panel p-5">
              <h2 className="font-display text-base font-bold uppercase tracking-wide text-white">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">{item.body}</p>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="card-panel p-6">
            <p className="section-label">First post checklist</p>
            <ul className="mt-4 space-y-3 text-sm text-ink-muted">
              <li>Clothes you can move in (layers in winter)</li>
              <li>Gloves if you have them</li>
              <li>Water bottle</li>
              <li>Optional: coupon (cinder block) — not required for FNGs</li>
              <li>Arrive ~5 minutes early</li>
            </ul>
            <Link href="/locations" className="btn btn-primary mt-6 w-full">
              Pick a Location
            </Link>
          </div>

          <div className="card-panel p-6">
            <p className="section-label">How to try F3</p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-muted">
              <li>Choose an AO from the Locations page.</li>
              <li>Show up. No form. No RSVP.</li>
              <li>Post the beatdown. Modify as needed.</li>
              <li>Stay for COT — names, nicknames, announcements.</li>
            </ol>
          </div>

          <div className="card-panel border-f3-red/40 p-6">
            <p className="section-label">Disclaimer</p>
            <div className="prose-gloom mt-3 text-sm">
              <p>
                F3 workouts are free, peer-led, and physically demanding. You participate at your own
                risk. F3 Lincoln is a regional expression of{" "}
                <a href={site.nationUrl} target="_blank" rel="noreferrer">
                  F3 Nation
                </a>
                .
              </p>
              <p>
                Read the official{" "}
                <a href={site.disclaimerUrl} target="_blank" rel="noreferrer">
                  F3 Nation disclaimer and notice
                </a>
                .
              </p>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <p className="section-label">The five core principles</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {fiveCorePrinciples.map((p) => (
            <div key={p.title} className="card-panel p-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wide text-white">
                {p.title}
              </h3>
              <p className="mt-2 text-xs text-ink-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FNG intake */}
      <section className="mt-12" id="contact">
        <div className="card-panel p-6 sm:p-8">
          <p className="section-label">Questions before you post?</p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase text-white">
            Reach the region
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-ink-muted">
            Prefer a human answer first? Send a note. Day-to-day chatter and Q sign-ups live in{" "}
            <a
              href={site.slackUrl}
              className="text-f3-red underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              F3 Lincoln Slack
            </a>
            .
          </p>

          {site.email ? (
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              action={`mailto:${site.email}`}
              method="post"
              encType="text/plain"
            >
              <label className="block text-sm sm:col-span-1">
                <span className="font-display text-xs font-bold uppercase tracking-wide text-ink-dim">
                  Name
                </span>
                <input
                  name="name"
                  required
                  className="mt-1 w-full rounded border border-gloom-border bg-gloom-deep px-4 py-3 text-ink outline-none focus:border-f3-red"
                />
              </label>
              <label className="block text-sm sm:col-span-1">
                <span className="font-display text-xs font-bold uppercase tracking-wide text-ink-dim">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 w-full rounded border border-gloom-border bg-gloom-deep px-4 py-3 text-ink outline-none focus:border-f3-red"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-display text-xs font-bold uppercase tracking-wide text-ink-dim">
                  Message
                </span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="mt-1 w-full rounded border border-gloom-border bg-gloom-deep px-4 py-3 text-ink outline-none focus:border-f3-red"
                  placeholder="When / where are you thinking of posting?"
                />
              </label>
              <button type="submit" className="btn btn-primary sm:col-span-2 sm:w-fit">
                Send Message
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded border border-dashed border-gloom-border bg-gloom-deep p-5 text-sm text-ink-muted">
                No email form yet — the fastest way in is Slack. Jump into the workspace, then show
                up at Sparta.
              </div>
              <a
                href={site.slackUrl}
                className="btn btn-primary w-full sm:w-auto"
                target="_blank"
                rel="noreferrer"
              >
                {site.slackLabel}
              </a>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
