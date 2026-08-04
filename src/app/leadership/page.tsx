import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { leaders } from "@/content/leadership";
import { roleDefinitions } from "@/lib/site";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "F3 Lincoln leadership directory. Nantan, Weasel Shaker, and Site Q are people — not workout styles.",
};

export default function LeadershipPage() {
  return (
    <PageShell
      eyebrow="Regional roles"
      title="Leadership Directory"
      intro="These are the men holding administrative roles for F3 Lincoln. Titles like Nantan, Weasel Shaker, and Site Q refer to people — not types of workouts."
    >
      <div className="card-panel mb-10 border-f3-red/30 p-5 sm:p-6">
        <p className="section-label">Important</p>
        <p className="mt-2 text-sm text-ink-muted">
          <strong className="text-ink">Nantan</strong>,{" "}
          <strong className="text-ink">Weasel Shaker</strong>, and{" "}
          <strong className="text-ink">Site Q</strong> are individual PAX with defined
          responsibilities. They are not exercise formats or AO styles.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {(["Nantan", "Weasel Shaker", "Site Q"] as const).map((role) => (
            <div key={role} className="rounded bg-gloom-deep p-3">
              <dt className="font-display text-xs font-bold uppercase tracking-wide text-f3-red">
                {role}
              </dt>
              <dd className="mt-1 text-xs text-ink-muted">{roleDefinitions[role]}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leaders.map((leader, index) => (
          <article key={`${leader.role}-${leader.f3Name}-${index}`} className="card-panel overflow-hidden">
            <div className="flex h-36 items-center justify-center bg-gloom-panel">
              {leader.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={leader.photoUrl}
                  alt={leader.f3Name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gloom-border bg-gloom font-display text-2xl font-bold text-ink-dim">
                  {leader.f3Name === "TBD" ? "?" : leader.f3Name.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-f3-red">
                {leader.role}
              </p>
              <h2 className="mt-1 font-display text-xl font-bold uppercase tracking-wide text-white">
                {leader.f3Name}
              </h2>
              {leader.ao ? (
                <p className="mt-1 text-xs text-ink-dim">AO: {leader.ao}</p>
              ) : null}
              <p className="mt-3 text-sm text-ink-muted">{leader.description}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink-dim">
        Update leaders in{" "}
        <code className="rounded bg-gloom px-1.5 py-0.5 text-xs text-ink-muted">
          src/content/leadership.ts
        </code>
        .
      </p>
    </PageShell>
  );
}
