"use client";

import { useMemo, useState } from "react";
import { formatShortDate } from "@/lib/format";
import {
  computeAttendanceLeaderboard,
  computeFirstJoins,
  computeQLeaderboard,
  defaultDateRange,
  downloadCsv,
  filterByDateRange,
  rowsToCsv,
  type JoinRecord,
  type LeaderboardRow,
  type StatsPost,
} from "@/lib/stats";

const RECENT_JOINERS_LIMIT = 10;

type Props = {
  posts: StatsPost[];
  error?: string;
};

/** Leaderboard boards — rendered inside PaxHub (password gated). */
export function LeaderboardBody({ posts, error }: Props) {
  const defaults = useMemo(() => defaultDateRange(posts), [posts]);
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);

  const filtered = useMemo(
    () => filterByDateRange(posts, from, to),
    [posts, from, to]
  );

  // First-join uses full archive history so “joined date” is true first appearance
  const joins = useMemo(() => computeFirstJoins(posts), [posts]);

  /** Newest 10 HIMs by first appearance (FNG or first roster/Q listing). */
  const recentJoiners = useMemo(
    () => joins.slice(0, RECENT_JOINERS_LIMIT),
    [joins]
  );

  const qBoard = useMemo(() => computeQLeaderboard(filtered), [filtered]);
  const attBoard = useMemo(
    () => computeAttendanceLeaderboard(filtered),
    [filtered]
  );

  function exportQs() {
    downloadCsv(
      `f3-lincoln-qs-${from || "all"}-to-${to || "all"}.csv`,
      rowsToCsv(
        ["Rank", "Name", "Qs"],
        qBoard.map((r) => [r.rank, r.name, r.count])
      )
    );
  }

  function exportAttendance() {
    downloadCsv(
      `f3-lincoln-attendance-${from || "all"}-to-${to || "all"}.csv`,
      rowsToCsv(
        ["Rank", "Name", "Posts attended"],
        attBoard.map((r) => [r.rank, r.name, r.count])
      )
    );
  }

  function exportJoins() {
    downloadCsv(
      `f3-lincoln-recent-joiners-top10.csv`,
      rowsToCsv(
        ["Name", "Joined (date)", "AO", "Listed as FNG", "First backblast"],
        recentJoiners.map((j) => [
          j.name,
          j.firstYmd,
          j.firstAo,
          j.asFng ? "Yes" : "No",
          j.firstTitle,
        ])
      )
    );
  }

  function exportAll() {
    const qRows = qBoard.map((r) => [
      "Qs led",
      r.rank,
      r.name,
      r.count,
      "",
      "",
      "",
    ]);
    const aRows = attBoard.map((r) => [
      "Attendance",
      r.rank,
      r.name,
      r.count,
      "",
      "",
      "",
    ]);
    const jRows = recentJoiners.map((j, i) => [
      "First join",
      i + 1,
      j.name,
      "",
      j.firstYmd,
      j.firstAo,
      j.asFng ? "Yes" : "No",
    ]);
    downloadCsv(
      `f3-lincoln-leaderboard-${from || "all"}-to-${to || "all"}.csv`,
      rowsToCsv(
        [
          "Board",
          "Rank",
          "Name",
          "Count",
          "Joined date",
          "First AO",
          "As FNG",
        ],
        [...qRows, ...aRows, ...jRows]
      )
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-dim">
          {posts.length} backblast{posts.length === 1 ? "" : "s"} loaded
          {filtered.length !== posts.length
            ? ` · ${filtered.length} in range for Q / attendance`
            : null}
        </p>
        <button
          type="button"
          className="btn btn-outline min-h-10 px-3 text-xs"
          onClick={exportAll}
        >
          Export all CSV
        </button>
      </div>

      {error ? (
        <div className="card-panel border-f3-red/40 p-5 text-sm text-ink-muted">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-f3-red">
            Data source
          </p>
          <p className="mt-2">{error}</p>
        </div>
      ) : null}

      <div className="card-panel grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <label className="block">
          <span className="mb-1.5 block font-display text-xs font-bold uppercase tracking-wide text-ink-dim">
            From
          </span>
          <input
            type="date"
            value={from}
            min={defaults.from}
            max={defaults.to}
            onChange={(e) => {
              const v = e.target.value;
              setFrom(v < defaults.from ? defaults.from : v > to ? to : v);
            }}
            className="field-input"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-display text-xs font-bold uppercase tracking-wide text-ink-dim">
            To
          </span>
          <input
            type="date"
            value={to}
            min={defaults.from}
            max={defaults.to}
            onChange={(e) => {
              const v = e.target.value;
              setTo(v > defaults.to ? defaults.to : v < from ? from : v);
            }}
            className="field-input"
          />
        </label>
        <p className="text-xs text-ink-dim sm:col-span-2">
          Range limited to available backblasts ({defaults.from} → {defaults.to}
          ). Filters Q and attendance boards. Recent joiners always use first
          appearance across the full archive (FNG or first post as PAX/Q) — top{" "}
          {RECENT_JOINERS_LIMIT} newest only.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LeaderTable
          title="Top Qs"
          subtitle="Beatdowns led in range"
          empty="No Qs in this range."
          rows={qBoard}
          countLabel="Qs"
          onExport={exportQs}
        />
        <LeaderTable
          title="Most posts"
          subtitle="Beatdowns attended in range"
          empty="No attendance in this range."
          rows={attBoard}
          countLabel="Posts"
          onExport={exportAttendance}
        />
      </div>

      <JoinTable joins={recentJoiners} onExport={exportJoins} />
    </div>
  );
}

function LeaderTable({
  title,
  subtitle,
  empty,
  rows,
  countLabel,
  onExport,
}: {
  title: string;
  subtitle: string;
  empty: string;
  rows: LeaderboardRow[];
  countLabel: string;
  onExport: () => void;
}) {
  return (
    <div className="card-panel overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gloom-border px-5 py-4">
        <div>
          <p className="section-label">{title}</p>
          <p className="mt-1 text-xs text-ink-dim">{subtitle}</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost min-h-9 px-3 text-xs"
          onClick={onExport}
          disabled={rows.length === 0}
        >
          CSV
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-ink-dim">{empty}</p>
      ) : (
        <div className="max-h-[28rem] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-gloom-panel text-ink-dim">
              <tr>
                <th className="px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-2 text-right font-display text-[10px] font-bold uppercase tracking-wider">
                  {countLabel}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gloom-border">
              {rows.map((row) => (
                <tr key={row.name} className="hover:bg-gloom-deep/60">
                  <td className="px-4 py-2.5 tabular-nums text-ink-dim">
                    {row.rank}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-ink">{row.name}</td>
                  <td className="px-4 py-2.5 text-right font-display text-base font-bold tabular-nums text-white">
                    {row.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function JoinTable({
  joins,
  onExport,
}: {
  joins: JoinRecord[];
  onExport: () => void;
}) {
  return (
    <div className="card-panel overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gloom-border px-5 py-4">
        <div>
          <p className="section-label">Most recent joiners</p>
          <p className="mt-1 text-xs text-ink-dim">
            Newest {RECENT_JOINERS_LIMIT} first appearances (FNG or first time as
            PAX/Q in the archive)
          </p>
        </div>
        <button
          type="button"
          className="btn btn-ghost min-h-9 px-3 text-xs"
          onClick={onExport}
          disabled={joins.length === 0}
        >
          CSV
        </button>
      </div>
      {joins.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-ink-dim">
          No PAX names found yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gloom-panel text-ink-dim">
              <tr>
                <th className="px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider">
                  Joined
                </th>
                <th className="hidden px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider sm:table-cell">
                  First AO
                </th>
                <th className="px-4 py-2 font-display text-[10px] font-bold uppercase tracking-wider">
                  FNG?
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gloom-border">
              {joins.map((j, i) => (
                <tr key={j.name} className="hover:bg-gloom-deep/60">
                  <td className="px-4 py-2.5 tabular-nums text-ink-dim">
                    {i + 1}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-ink">{j.name}</td>
                  <td className="px-4 py-2.5 tabular-nums text-ink-muted">
                    <time dateTime={j.firstDate}>
                      {formatShortDate(j.firstDate)}
                    </time>
                  </td>
                  <td className="hidden px-4 py-2.5 text-ink-dim sm:table-cell">
                    {j.firstAo}
                  </td>
                  <td className="px-4 py-2.5">
                    {j.asFng ? (
                      <span className="rounded bg-f3-red/20 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wide text-f3-red">
                        FNG
                      </span>
                    ) : (
                      <span className="text-ink-dim">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
