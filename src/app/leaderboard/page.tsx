import { redirect } from "next/navigation";

/**
 * Leaderboard lives under the password-gated /stats hub.
 * Keep this route so old bookmarks and Pax menu links still work.
 */
export default function LeaderboardRedirectPage() {
  redirect("/stats?tab=leaderboard");
}
