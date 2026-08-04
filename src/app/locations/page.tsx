import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SlackCta } from "@/components/SlackCta";
import { aos } from "@/content/aos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Locations & Schedule",
  description:
    "F3 Lincoln AO Sparta — Mon/Wed/Fri 5:30–6:15 AM. Bootcamp midweek, Muscle Beach Fridays. Optional 5:00 AM pre-run.",
};

export default function LocationsPage() {
  return (
    <PageShell
      eyebrow="Areas of Operation"
      title="Locations & Schedule"
      intro="F3 Lincoln posts at one AO: Sparta. Workouts are always outdoors. Schedule here is read-only — claim Q spots in Slack via Paxminer."
    >
      <div className="space-y-8">
        <SlackCta
          label="Claim a Q spot"
          description="Q sign-ups and last-minute AO chatter live in Slack (Paxminer). Join the workspace, then grab your slot."
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">
            {aos.length} AO · Home flag at{" "}
            <strong className="text-ink">Sparta</strong>
          </p>
          <a href={site.mapUrl} className="btn btn-ghost" target="_blank" rel="noreferrer">
            Open Nation Map
          </a>
        </div>

        {aos.map((ao) => (
          <article key={ao.id} className="card-panel overflow-hidden">
            <div className="border-b border-gloom-border bg-gloom-panel page-x px-5 py-5 sm:px-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="section-label">Home AO</p>
                  <h2 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-white">
                    {ao.name}
                  </h2>
                </div>
                <a
                  href={ao.mapUrl}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Map
                </a>
              </div>
              <p className="mt-3 max-w-3xl text-sm text-ink-muted">{ao.description}</p>
            </div>

            <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
              <Fact
                label="Days"
                value={ao.days.join(" · ")}
              />
              <Fact label="Main beatdown" value={ao.time} />
              <Fact
                label="Pre-run (optional)"
                value={
                  ao.preRun
                    ? `${ao.preRun.time} · ${ao.preRun.days.map((d) => d.slice(0, 3)).join("/")}`
                    : "—"
                }
              />
              <Fact
                label="Meet point"
                value={
                  <a
                    href={ao.mapUrl}
                    className="underline decoration-gloom-border underline-offset-2 hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {ao.address}
                  </a>
                }
              />
            </div>

            {ao.styleByDay ? (
              <div className="border-t border-gloom-border p-5 sm:p-6">
                <p className="font-display text-xs font-bold uppercase tracking-wide text-ink-dim">
                  By day
                </p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                  {ao.days.map((day) => (
                    <li key={day} className="rounded border border-gloom-border bg-gloom-deep p-4">
                      <div className="font-display text-sm font-bold uppercase tracking-wide text-white">
                        {day}
                      </div>
                      <div className="mt-1 text-sm text-f3-red">
                        {ao.styleByDay?.[day] ?? ao.style}
                      </div>
                      <div className="mt-1 text-xs text-ink-dim">{ao.time}</div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-ink-dim">
                  The Q is free to audible anytime — style notes are the usual pattern, not a contract.
                </p>
              </div>
            ) : null}

            {ao.preRun ? (
              <div className="border-t border-gloom-border bg-gloom-deep/60 p-5 sm:p-6">
                <p className="font-display text-xs font-bold uppercase tracking-wide text-f3-red">
                  Optional 5:00 AM pre-run
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  {ao.preRun.notes ??
                    `A group often meets at ${ao.preRun.time} for a pre-run before the main beatdown.`}
                </p>
              </div>
            ) : null}

            {ao.siteQ?.length && ao.siteQ[0] !== "TBD" ? (
              <div className="border-t border-gloom-border p-5 text-sm text-ink-muted sm:px-6">
                Site Q: <span className="text-ink">{ao.siteQ.join(", ")}</span>
              </div>
            ) : null}
          </article>
        ))}

        <div className="card-panel p-5 text-sm text-ink-muted">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-white">
            Scheduling note
          </p>
          <p className="mt-2">
            This page is a <strong className="text-ink">read-only</strong> reference. Official Q
            claims and last-minute changes happen in Slack (Paxminer). Always verify in Slack if
            something looks off.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function Fact({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border-t border-gloom-border p-5 sm:border-t-0 sm:border-l sm:first:border-l-0 sm:p-6">
      <div className="text-xs uppercase tracking-wide text-ink-dim">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
    </div>
  );
}
