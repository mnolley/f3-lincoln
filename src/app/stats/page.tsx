import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PaxStats } from "@/components/PaxStats";
import { fetchSlackBackblasts } from "@/lib/slack/fetch-backblasts";
import { toStatsPosts } from "@/lib/stats";

export const metadata: Metadata = {
  title: "PAX Stats",
  description: "Password-protected summary stats from F3 Lincoln backblasts.",
  robots: { index: false, follow: false },
};

// Revalidate Slack data every 5 minutes
export const revalidate = 300;

export default async function StatsPage() {
  // Pull more history than the public list so date-range stats are useful
  const { posts, error } = await fetchSlackBackblasts({
    limit: 200,
    maxPages: 8,
  });

  return (
    <PageShell
      eyebrow="For the pack"
      title="PAX Stats"
      intro="How many times you've Q'd or posted — filtered by date range and HIM. Password required."
    >
      <PaxStats posts={toStatsPosts(posts)} error={error} />
    </PageShell>
  );
}
