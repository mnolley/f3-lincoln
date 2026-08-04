import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { workouts } from "@/lib/site";

export default function SchedulePage() {
  return (
    <PageShell
      title="Schedule"
      intro="Weekly rhythm for F3 Lincoln. Full AO details live on the Workouts page."
    >
      <div className="overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3 font-medium">AO</th>
              <th className="px-4 py-3 font-medium">Day</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Location</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((ao) => (
              <tr key={ao.name} className="border-t border-zinc-200">
                <td className="px-4 py-3 font-medium">{ao.name}</td>
                <td className="px-4 py-3">{ao.day}</td>
                <td className="px-4 py-3">{ao.time}</td>
                <td className="px-4 py-3">{ao.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm text-zinc-600">
        New to F3? Start with the{" "}
        <Link href="/join" className="font-medium underline">
          how to join
        </Link>{" "}
        guide.
      </p>
    </PageShell>
  );
}
