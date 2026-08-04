import { PageShell } from "@/components/PageShell";
import { workouts } from "@/lib/site";

export default function WorkoutsPage() {
  return (
    <PageShell
      title="Workouts (AOs)"
      intro="Areas of Operation — the regular places and times we post. Edit the list in src/lib/site.ts."
    >
      <div className="space-y-4">
        {workouts.map((ao) => (
          <article key={ao.name} className="rounded-2xl border border-zinc-200 p-5">
            <h2 className="text-xl font-semibold">{ao.name}</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-zinc-500">When</dt>
                <dd className="font-medium">
                  {ao.day} · {ao.time}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Style</dt>
                <dd className="font-medium">{ao.style}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-zinc-500">Where</dt>
                <dd className="font-medium">{ao.location}</dd>
              </div>
              {ao.notes ? (
                <div className="sm:col-span-2">
                  <dt className="text-zinc-500">Notes</dt>
                  <dd>{ao.notes}</dd>
                </div>
              ) : null}
            </dl>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
