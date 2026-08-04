import { PageShell } from "@/components/PageShell";

export default function BackblastsPage() {
  return (
    <PageShell
      title="Backblasts"
      intro="Workout write-ups from the Q. This page is a placeholder for future posts or a link to your backblast app."
    >
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-sm text-zinc-600">
        No backblasts wired up yet. You already have a Backblast project at{" "}
        <code className="rounded bg-white px-1.5 py-0.5">C:\Users\Mark\Projects\Backblast</code> —
        we can connect it later.
      </div>
    </PageShell>
  );
}
