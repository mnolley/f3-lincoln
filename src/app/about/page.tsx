import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";
import { f3FiveCorePrinciples } from "@/content/copy";

export default function AboutPage() {
  return (
    <PageShell
      title="About F3"
      intro={`${site.name} is a free, peer-led men’s workout community in ${site.city}.`}
    >
      <div className="prose prose-zinc max-w-2xl space-y-4 text-zinc-700">
        <p>
          <strong>F3</strong> stands for <em>Fitness, Fellowship, and Faith</em>. Workouts are always free,
          always outdoors, and always end with a Circle of Trust.
        </p>
        <p>{site.mission}</p>
      </div>
      <ul className="mt-10 space-y-4">
        {f3FiveCorePrinciples.map((item) => (
          <li key={item.title} className="rounded-xl border border-zinc-200 p-4">
            <div className="font-semibold">{item.title}</div>
            <p className="mt-1 text-sm text-zinc-600">{item.body}</p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
