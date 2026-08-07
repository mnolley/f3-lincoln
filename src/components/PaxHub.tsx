"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { StatsPost } from "@/lib/stats";
import { PaxAuthGate } from "./PaxAuthGate";
import { StatsBody } from "./PaxStats";
import { LeaderboardBody } from "./PaxLeaderboard";

export type PaxHubTab = "stats" | "leaderboard";

type Props = {
  posts: StatsPost[];
  error?: string;
  /** Server default when no ?tab= query */
  initialTab?: PaxHubTab;
};

function tabFromParam(value: string | null, fallback: PaxHubTab): PaxHubTab {
  if (value === "leaderboard" || value === "stats") return value;
  return fallback;
}

/**
 * Single password-gated hub for individual stats + leaderboard.
 * Unlock once; switch tabs without re-entering the password.
 */
export function PaxHub({ posts, error, initialTab = "stats" }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const active = tabFromParam(searchParams.get("tab"), initialTab);
  const [tab, setTab] = useState<PaxHubTab>(active);

  useEffect(() => {
    setTab(active);
  }, [active]);

  function selectTab(next: PaxHubTab) {
    setTab(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "stats") {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  return (
    <PaxAuthGate blurb="PAX stats and leaderboards are for the pack. Enter the password to continue.">
      <div className="space-y-6">
        <div
          className="flex flex-wrap gap-2 border-b border-gloom-border pb-3"
          role="tablist"
          aria-label="PAX tools"
        >
          <TabButton
            active={tab === "stats"}
            onClick={() => selectTab("stats")}
          >
            My stats
          </TabButton>
          <TabButton
            active={tab === "leaderboard"}
            onClick={() => selectTab("leaderboard")}
          >
            Leaderboard
          </TabButton>
        </div>

        {tab === "stats" ? (
          <StatsBody posts={posts} error={error} />
        ) : (
          <LeaderboardBody posts={posts} error={error} />
        )}
      </div>
    </PaxAuthGate>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
        active
          ? "bg-f3-red text-white"
          : "bg-gloom text-ink-muted hover:bg-gloom-deep hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
