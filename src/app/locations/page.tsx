import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SlackCta } from "@/components/SlackCta";
import { aos } from "@/content/aos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Locations & Schedule",
  description: "F3 Lincoln Areas of Operation (AOs) — days, times, styles, and map links.",
};

export default function LocationsPage() {
  return (
    <PageShell
      eyebrow="Areas of Operation"
      title="Locations & Schedule"
      intro="Find an AO near you. Workouts are always outdoors. This site is read-only for schedule — claim Q spots in Slack via Paxminer."
    >
      <div className="space-y-8">
        <SlackCta />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">
            {aos.length} AO{aos.length === 1 ? "" : "s"} listed · Update{" "}
            <code className="rounded bg-gloom px-1.5 py-0.5 text-xs">src/content/aos.ts</code>
          </p>
          <a
            href={site.mapUrl}
            className="btn btn-ghost"
            target="_blank"
            rel="noreferrer"
          >
            Open Nation Map
          </a>
        </div>

        {/* Mobile-friendly cards */}
        <div className="grid gap-4 lg:hidden">
          {aos.map((ao) => (
            <article key={ao.id} className="card-panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                  {ao.name}
                </h2>
                <span className="rounded bg-f3-red/15 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-f3-red">
                  {ao.style}
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="text-ink-dim">When</dt>
                  <dd className="font-medium text-ink">
                    {ao.days.join(", ")} · {ao.time}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-dim">Where</dt>
                  <dd className="text-ink">
                    <a
                      href={ao.mapUrl}
                      className="underline decoration-gloom-border underline-offset-2 hover:text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {ao.address}
                    </a>
                  </dd>
                </div>
                {ao.siteQ?.length ? (
                  <div>
                    <dt className="text-ink-dim">Site Q</dt>
                    <dd className="text-ink">{ao.siteQ.join(", ")}</dd>
                  </div>
                ) : null}
              </dl>
              {ao.description ? (
                <p className="mt-3 text-sm text-ink-muted">{ao.description}</p>
              ) : null}
            </article>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto rounded-lg border border-gloom-border lg:block">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gloom font-display text-xs uppercase tracking-wider text-ink-dim">
              <tr>
                <th className="px-4 py-3 font-bold">AO</th>
                <th className="px-4 py-3 font-bold">Days</th>
                <th className="px-4 py-3 font-bold">Time</th>
                <th className="px-4 py-3 font-bold">Style</th>
                <th className="px-4 py-3 font-bold">Location</th>
                <th className="px-4 py-3 font-bold">Site Q</th>
              </tr>
            </thead>
            <tbody>
              {aos.map((ao) => (
                <tr key={ao.id} className="border-t border-gloom-border bg-gloom-deep/50">
                  <td className="px-4 py-4 font-display font-bold uppercase tracking-wide text-white">
                    {ao.name}
                  </td>
                  <td className="px-4 py-4 text-ink-muted">{ao.days.join(", ")}</td>
                  <td className="px-4 py-4 text-ink-muted">{ao.time}</td>
                  <td className="px-4 py-4">
                    <span className="rounded bg-f3-red/15 px-2 py-1 text-xs font-semibold text-f3-red">
                      {ao.style}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <a
                      href={ao.mapUrl}
                      className="text-ink-muted underline decoration-gloom-border underline-offset-2 hover:text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {ao.address}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-ink-muted">
                    {ao.siteQ?.join(", ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-panel p-5 text-sm text-ink-muted">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-white">
            Scheduling note
          </p>
          <p className="mt-2">
            This page is a <strong className="text-ink">read-only</strong> reference. Official Q
            claims and last-minute AO changes happen in Slack (Paxminer). Always verify in Slack
            before you post if something looks off.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
