import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { PaxHub } from "@/components/PaxHub";
import { getBackblasts } from "@/lib/backblasts";
import { toStatsPosts } from "@/lib/stats";

export const metadata: Metadata = {
  title: "PAX Stats & Leaderboard",
  description:
    "Password-protected F3 Lincoln stats and leaderboards from the backblast archive.",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

export default async function StatsPage() {
  const { posts, error } = await getBackblasts({
    limit: 200,
    maxPages: 8,
  });

  return (
    <PageShell
      eyebrow="For the pack"
      title="PAX Stats"
      intro="Individual stats and region leaderboards. Password required — unlock once, then switch tabs."
    >
      <Suspense
        fallback={
          <div className="card-panel p-8 text-center text-sm text-ink-dim">
            Loading…
          </div>
        }
      >
        <PaxHub posts={toStatsPosts(posts)} error={error} />
      </Suspense>
    </PageShell>
  );
}
