import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { getAllPosts } from "@/content/backblasts";
import { formatPostDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Backblasts",
  description: "F3 Lincoln pre-blasts and backblasts — upcoming beatdowns and workout summaries.",
};

export default function BackblastsPage() {
  const posts = getAllPosts();

  return (
    <PageShell
      eyebrow="The archive"
      title="Backblasts & Pre-blasts"
      intro="Pre-blasts announce what’s coming. Backblasts record what went down — Warm-A-Rama, The Thang, COT, and the PAX."
    >
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="card-panel p-8 text-center text-sm text-ink-muted">
            No posts yet. Seed content lives in{" "}
            <code className="rounded bg-gloom-deep px-1.5 py-0.5 text-xs">
              src/content/backblasts.ts
            </code>
            .
          </div>
        ) : (
          posts.map((post) => {
            const isBackblast = post.kind === "backblast";
            return (
              <article key={post.id} className="card-panel p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-1 font-display text-[10px] font-bold uppercase tracking-wider ${
                      isBackblast
                        ? "bg-gloom-border/60 text-ink"
                        : "bg-f3-red/20 text-f3-red"
                    }`}
                  >
                    {isBackblast ? "Backblast" : "Pre-blast"}
                  </span>
                  <time className="text-xs text-ink-dim" dateTime={post.date}>
                    {formatPostDate(post.date)}
                  </time>
                </div>

                <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-white">
                  {isBackblast ? (
                    <Link href={`/backblasts/${post.id}`} className="hover:text-f3-red">
                      {post.title}
                    </Link>
                  ) : (
                    post.title
                  )}
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
                    <dt className="text-ink-dim">Theme</dt>
                    <dd className="text-ink">{post.theme}</dd>
                  </div>
                </dl>

                {isBackblast ? (
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
                ) : (
                  post.summary && (
                    <p className="mt-4 text-sm text-ink-muted">{post.summary}</p>
                  )
                )}
              </article>
            );
          })
        )}
      </div>

      <p className="mt-8 text-xs text-ink-dim">
        Future: publishing a post can POST a JSON payload to a Slack webhook (title, AO, QIC, link).
        Schema ready in <code className="text-ink-muted">src/lib/types.ts</code>.
      </p>
    </PageShell>
  );
}
