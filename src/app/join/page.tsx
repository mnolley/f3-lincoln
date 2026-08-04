import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { howToJoin } from "@/content/copy";

export default function JoinPage() {
  return (
    <PageShell
      title="How to join"
      intro="No signup form. No fees. Show up to a workout and post with the PAX."
    >
      <ol className="space-y-4">
        {howToJoin.map((item) => (
          <li key={item.step} className="flex gap-4 rounded-2xl border border-zinc-200 p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
              {item.step}
            </span>
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-zinc-600">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8">
        <Link
          href="/schedule"
          className="inline-flex rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Pick a workout time
        </Link>
      </div>
    </PageShell>
  );
}
