import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { formatShortDate, formatWorkoutWhen } from "@/lib/format";
import { getBackblasts } from "@/lib/backblasts";

export const metadata: Metadata = {
  title: "Backblasts",
  description:
    "F3 Lincoln backblasts from Slack — workout summaries posted via Paxminer.",
};

// Revalidate Slack + archive every 5 minutes
export const revalidate = 300;

export default async function BackblastsPage() {
  const { posts, error, fromArchive } = await getBackblasts({
    limit: 100,
    maxPages: 5,
  });

  return (
    <PageShell
      eyebrow="The archive"
      title="Backblasts"
      intro="From the #backblast Slack channel (Paxminer posts) plus a durable archive so old beatdowns stay available after Slack history rolls off."
    >
      {error ? (
        <div className="card-panel border-f3-red/40 p-5 text-sm text-ink-muted">
          <p className="font-display text-xs font-bold uppercase tracking-wide text-f3-red">
            Slack connection
          </p>
          <p className="mt-2">{error}</p>
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {!error && posts.length === 0 ? (
          <div className="card-panel p-8 text-center text-sm text-ink-muted">
            No Paxminer backblasts found in the channel yet.
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="card-panel p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-gloom-border/60 px-2 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-ink">
                  Backblast
                </span>
                <time className="text-xs text-ink-dim" dateTime={post.date}>
                  {formatShortDate(post.date)}
                </time>
              </div>

              <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-white">
                <Link href={`/backblasts/${post.id}`} className="hover:text-f3-red">
                  {post.title}
                </Link>
              </h2>

              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-ink-dim">AO</dt>
                  <dd className="text-ink">{post.ao}</dd>
                </div>
                <div>
                  <dt className="text-ink-dim">QIC</dt>
                  <dd className="text-ink">{post.qic}</dd>
                </div>
                <div>
                  <dt className="text-ink-dim">When</dt>
                  <dd className="text-ink">{formatWorkoutWhen(post.date)}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-muted">
                <span>
                  <strong className="text-ink">{post.paxCount}</strong> PAX
                </span>
                <span>
                  <strong className="text-ink">{post.fngCount}</strong> FNG
                  {post.fngCount === 1 ? "" : "s"}
                </span>
                <Link
                  href={`/backblasts/${post.id}`}
                  className="font-display text-xs font-bold uppercase tracking-wide text-f3-red hover:underline"
                >
                  Read full backblast →
                </Link>
              </div>
            </article>
          ))
        )}
      </div>

      <p className="mt-8 text-xs text-ink-dim">
        Sourced from Slack via <code className="text-ink-muted">conversations.history</code>
        {fromArchive ? " and the durable archive" : ""}. Refreshes about every 5 minutes.
        New posts are saved automatically so they remain after Slack drops them.
      </p>
    </PageShell>
  );
}
