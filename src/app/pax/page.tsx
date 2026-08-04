import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { SlackCta } from "@/components/SlackCta";
import { paxMenu } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pax Resources",
  description:
    "F3 Lincoln Pax hub — schedule, backblasts, Exicon, Lexicon, Q Source, gear, and Nation tools.",
};

export default function PaxPage() {
  return (
    <PageShell
      eyebrow="For the PAX"
      title="Pax Resources"
      intro="Everything active HIMs need — Lincoln ops plus F3 Nation tools. Same links as the Pax menu in the header."
    >
      <div className="mb-8">
        <SlackCta />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {paxMenu.map((group) => (
          <section key={group.title} className="card-panel p-5 sm:p-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-f3-red">
              {group.title}
            </h2>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.href + link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="group block rounded-md border border-transparent p-2 hover:border-gloom-border hover:bg-gloom-deep"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="font-display text-xs font-bold uppercase tracking-wide text-white group-hover:text-f3-red">
                        {link.label} ↗
                      </span>
                      {link.description ? (
                        <p className="mt-1 text-xs text-ink-dim">{link.description}</p>
                      ) : null}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="group block rounded-md border border-transparent p-2 hover:border-gloom-border hover:bg-gloom-deep"
                    >
                      <span className="font-display text-xs font-bold uppercase tracking-wide text-white group-hover:text-f3-red">
                        {link.label}
                      </span>
                      {link.description ? (
                        <p className="mt-1 text-xs text-ink-dim">{link.description}</p>
                      ) : null}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
