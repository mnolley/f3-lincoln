import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { PaxLeaderboard } from "@/components/PaxLeaderboard";
import { fetchSlackBackblasts } from "@/lib/slack/fetch-backblasts";
import { toStatsPosts } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Password-protected F3 Lincoln leaderboards — top Qs, attendance, and recent joiners.",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

export default async function LeaderboardPage() {
  const { posts, error } = await fetchSlackBackblasts({
    limit: 200,
    maxPages: 8,
  });

  return (
    <PageShell
      eyebrow="For the pack"
      title="Leaderboard"
      intro="Top Qs, most posts, and who joined most recently — from Slack backblasts. Password required. Export any board to CSV."
    >
      <PaxLeaderboard posts={toStatsPosts(posts)} error={error} />
    </PageShell>
  );
}
