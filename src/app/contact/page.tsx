import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      intro="Connect with F3 Lincoln leadership and the PAX."
    >
      <div className="space-y-4 text-zinc-700">
        <p>
          Update contact links in <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">src/lib/site.ts</code>.
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm">
          <li>
            Email: {site.email || <span className="text-zinc-400">not set yet</span>}
          </li>
          <li>
            Slack: {site.slackUrl || <span className="text-zinc-400">not set yet</span>}
          </li>
          <li>
            Facebook: {site.facebookUrl || <span className="text-zinc-400">not set yet</span>}
          </li>
        </ul>
      </div>
    </PageShell>
  );
}
