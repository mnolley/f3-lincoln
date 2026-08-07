"use client";

import { useMemo, useState, useEffect } from "react";
import { formatShortDate } from "@/lib/format";
import {
  collectPaxNames,
  computeStat,
  defaultDateRange,
  filterByDateRange,
  type StatKind,
  type StatsPost,
} from "@/lib/stats";

const AUTH_KEY = "f3lincoln-pax-stats";
const PASSWORD = "gloom";

type Props = {
  posts: StatsPost[];
  error?: string;
};

export function PaxStats({ posts, error }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const defaults = useMemo(() => defaultDateRange(posts), [posts]);
  const [from, setFrom] = useState(defaults.from);
  const [to, setTo] = useState(defaults.to);
  const [person, setPerson] = useState("");
  const [kind, setKind] = useState<StatKind>("q");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(AUTH_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {
      // ignore private mode
    }
  }, []);

  const people = useMemo(() => collectPaxNames(posts), [posts]);

  const filtered = useMemo(
    () => filterByDateRange(posts, from, to),
    [posts, from, to]
  );

  const result = useMemo(
    () => computeStat(filtered, person, kind),
    [filtered, person, kind]
  );

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (password.trim().toLowerCase() === PASSWORD) {
      try {
        sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        // ignore
      }
      setUnlocked(true);
      setAuthError("");
      setPassword("");
    } else {
      setAuthError("Wrong password. Try again, HIM.");
    }
  }

  function handleLock() {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      // ignore
    }
    setUnlocked(false);
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md">
        <div className="card-panel p-6 sm:p-8">
          <p className="section-label">Restricted</p>
          <h2 className="mt-2 font-display text-xl font-bold uppercase text-white">
            Enter the Gloom
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            PAX stats are for the pack. Enter the password to continue.
          </p>
          <form onSubmit={handleUnlock} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="pax-stats-password"
                className="mb-1.5 block font-display text-xs font-bold uppercase tracking-wide text-ink-dim"
              >
                Password
              </label>
              <input
                id="pax-stats-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gloom-border bg-gloom-deep px-3 py-3 text-ink outline-none focus:border-f3-red"
                placeholder="•••••"
              />
            </div>
            {authError ? (
              <p className="text-sm text-f3-red" role="alert">
                {authError}
              </p>
            ) : null}
            <button type="submit" className="btn btn-primary w-full">
              Unlock stats
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-dim">
          {posts.length} backblast{posts.length === 1 ? "" : "s"} loaded
          {filtered.length !== posts.length
            ? ` · ${filtered.length} in range`
            : null}
        </p>
        <button type="button" className="btn btn-ghost min-h-10 px-3 text-xs" onClick={handleLock}>
          Lock
        </button>
      </div>

      {error ? (
        <div className="card-panel border-f3-red/40 p-5 text-sm text-ink-muted">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-f3-red">
            Slack connection
          </p>
          <p className="mt-2">{error}</p>
        </div>
      ) : null}

      <div className="card-panel grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
        <Field label="From">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="To">
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Person">
          <select
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="field-input"
          >
            <option value="">Select a PAX…</option>
            {people.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Statistic">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as StatKind)}
            className="field-input"
          >
            <option value="q">Beatdowns Q&apos;d (led)</option>
            <option value="attendance">Beatdowns attended</option>
          </select>
        </Field>
      </div>

      <div className="card-panel p-6 sm:p-8">
        {!person ? (
          <p className="text-center text-ink-muted">
            Choose a person, date range, and statistic above.
          </p>
        ) : (
          <>
            <p className="section-label">
              {kind === "q" ? "Qs led" : "Posts attended"}
            </p>
            <p className="mt-2 font-display text-sm uppercase tracking-wide text-ink-dim">
              {person}
              <span className="text-ink-dim"> · </span>
              {from || "…"} → {to || "…"}
            </p>
            <p className="mt-4 font-display text-6xl font-extrabold tabular-nums text-white sm:text-7xl">
              {result.count}
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              {kind === "q"
                ? `beatdown${result.count === 1 ? "" : "s"} Q'd in this range`
                : `beatdown${result.count === 1 ? "" : "s"} attended in this range`}
              {filtered.length > 0 ? (
                <span className="text-ink-dim">
                  {" "}
                  (of {filtered.length} total in range)
                </span>
              ) : null}
            </p>
          </>
        )}
      </div>

      {person && result.matching.length > 0 ? (
        <div className="card-panel overflow-hidden">
          <div className="border-b border-gloom-border px-5 py-3">
            <p className="font-display text-xs font-bold uppercase tracking-wide text-ink-dim">
              Matching beatdowns
            </p>
          </div>
          <ul className="divide-y divide-gloom-border">
            {result.matching.map((post) => (
              <li key={post.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-3 text-sm">
                <time className="shrink-0 text-ink-dim" dateTime={post.date}>
                  {formatShortDate(post.date)}
                </time>
                <span className="font-medium text-ink">{post.ao}</span>
                <span className="text-ink-muted">{post.title}</span>
                {kind === "attendance" ? (
                  <span className="text-xs text-ink-dim">
                    Q: {post.qic}
                    {personIsQClient(post, person) ? " (you)" : ""}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {person && result.count === 0 && filtered.length > 0 ? (
        <p className="text-center text-sm text-ink-dim">
          No matching beatdowns for {person} in this range.
        </p>
      ) : null}
    </div>
  );
}

function personIsQClient(post: StatsPost, person: string): boolean {
  return post.qic
    .split(/\s*(?:,|&|\/|\band\b)\s*/i)
    .some((q) => q.trim().toLowerCase() === person.trim().toLowerCase());
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-xs font-bold uppercase tracking-wide text-ink-dim">
        {label}
      </span>
      {children}
    </label>
  );
}
