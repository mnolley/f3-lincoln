import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { getBackblastById } from "@/content/backblasts";
import { formatPostDate } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = getBackblastById(id);
  if (!post) return { title: "Backblast" };
  return { title: post.title, description: `${post.ao} · QIC ${post.qic}` };
}

export default async function BackblastDetailPage({ params }: Props) {
  const { id } = await params;
  const post = getBackblastById(id);
  if (!post) notFound();

  return (
    <PageShell eyebrow="Backblast" title={post.title} intro={`${post.ao} · QIC ${post.qic}`}>
      <div className="mb-6">
        <Link
          href="/backblasts"
          className="font-display text-xs font-bold uppercase tracking-wide text-ink-dim hover:text-white"
        >
          ← All posts
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Meta label="When" value={formatPostDate(post.date)} />
        <Meta label="AO" value={post.ao} />
        <Meta label="Theme" value={post.theme} />
        <Meta
          label="Headcount"
          value={`${post.paxCount} PAX · ${post.fngCount} FNG${post.fngCount === 1 ? "" : "s"}`}
        />
      </div>

      {post.playlistUrl ? (
        <p className="mt-4 text-sm">
          <a
            href={post.playlistUrl}
            className="text-f3-red underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Workout playlist
          </a>
        </p>
      ) : null}

      <div className="mt-8 space-y-6">
        <Section title="Warm-A-Rama" body={post.warmARama} />
        <Section title="The Thang" body={post.theThang} />
        <Section title="COT" body={post.cot} />
        <section className="card-panel p-5 sm:p-6">
          <h2 className="font-display text-sm font-bold uppercase tracking-wide text-f3-red">
            Pax Roster
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            {post.paxRoster.length ? post.paxRoster.join(", ") : "—"}
          </p>
        </section>
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
