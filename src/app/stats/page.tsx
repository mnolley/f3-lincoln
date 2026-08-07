import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PaxStats } from "@/components/PaxStats";
import { getBackblasts } from "@/lib/backblasts";
import { toStatsPosts } from "@/lib/stats";

export const metadata: Metadata = {
  title: "PAX Stats",
  description: "Password-protected summary stats from F3 Lincoln backblasts.",
  robots: { index: false, follow: false },
};

// Revalidate Slack + archive every 5 minutes
export const revalidate = 300;

export default async function StatsPage() {
  // Full archive + live Slack so date-range stats keep growing over time
  const { posts, error } = await getBackblasts({
    limit: 200,
    maxPages: 8,
  });

  return (
    <PageShell
      eyebrow="For the pack"
      title="PAX Stats"
      intro="How many times you've Q'd or posted — filtered by date range and HIM. Password required. Uses the durable backblast archive."
    >
      <PaxStats posts={toStatsPosts(posts)} error={error} />
    </PageShell>
  );
}
