import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { formatWorkoutWhen } from "@/lib/format";
import { getBackblastById } from "@/lib/backblasts";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { post } = await getBackblastById(id);
  if (!post) return { title: "Backblast" };
  return { title: post.title, description: `${post.ao} · QIC ${post.qic}` };
}

export default async function BackblastDetailPage({ params }: Props) {
  const { id } = await params;
  const { post, error } = await getBackblastById(id);

  if (error === "Backblast not found" || !post) {
    notFound();
  }

  return (
    <PageShell eyebrow="Backblast" title={post.title} intro={`${post.ao} · QIC ${post.qic}`}>
      <div className="mb-6">
        <Link
          href="/backblasts"
          className="font-display text-xs font-bold uppercase tracking-wide text-ink-dim hover:text-white"
        >
          ← All backblasts
        </Link>
      </div>

      {error && error !== "Backblast not found" ? (
        <div className="card-panel mb-6 border-f3-red/40 p-4 text-sm text-ink-muted">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Meta label="When" value={formatWorkoutWhen(post.date)} />
        <Meta label="AO" value={post.ao} />
        <Meta label="QIC" value={post.qic} />
        <Meta
          label="Headcount"
          value={`${post.paxCount} PAX · ${post.fngCount} FNG${post.fngCount === 1 ? "" : "s"}`}
        />
      </div>

      <div className="mt-8 space-y-6">
        {post.warmARama ? <Section title="Warm-A-Rama" body={post.warmARama} /> : null}
        {post.theThang ? <Section title="The Thang" body={post.theThang} /> : null}
        {post.cot ? <Section title="COT" body={post.cot} /> : null}

        {!post.warmARama && !post.theThang && post.body ? (
          <Section title="The Beatdown" body={post.body} />
        ) : null}

        {post.paxRoster.length > 0 ? (
          <section className="card-panel p-5 sm:p-6">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-f3-red">
              Pax Roster
            </h2>
            <p className="mt-3 text-sm text-ink-muted">{post.paxRoster.join(", ")}</p>
            {post.fngs ? (
              <p className="mt-2 text-sm text-ink-dim">FNGs: {post.fngs}</p>
            ) : null}
          </section>
        ) : null}
      </div>
    </PageShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-panel p-4">
      <div className="text-xs uppercase tracking-wide text-ink-dim">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="card-panel p-5 sm:p-6">
      <h2 className="font-display text-sm font-bold uppercase tracking-wide text-f3-red">
        {title}
      </h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">{body}</p>
    </section>
  );
}
