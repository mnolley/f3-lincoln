import { site } from "@/lib/site";

type SlackCtaProps = {
  compact?: boolean;
  /** Optional override for the supporting blurb */
  description?: string;
  /** Optional override for the section label */
  label?: string;
};

export function SlackCta({
  compact = false,
  description,
  label = "Join the Slack",
}: SlackCtaProps) {
  if (!site.slackUrl) {
    return (
      <div className={`card-panel ${compact ? "p-4" : "p-6"}`}>
        <p className="section-label">Slack</p>
        <p className={`mt-2 text-ink-muted ${compact ? "text-sm" : ""}`}>
          Official Q sign-ups and regional chatter live in Slack. Add{" "}
          <code className="rounded bg-gloom-deep px-1.5 py-0.5 text-xs text-ink">site.slackUrl</code>{" "}
          in <code className="rounded bg-gloom-deep px-1.5 py-0.5 text-xs text-ink">src/lib/site.ts</code>.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`card-panel flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${compact ? "p-4" : "p-6"}`}
    >
      <div>
        <p className="section-label">{label}</p>
        <p className={`mt-2 text-ink-muted ${compact ? "text-sm" : ""}`}>
          {description ??
            "Claim Q spots (Paxminer), get Pre-blasts, and stay in the daily chatter. Free — just join the workspace."}
        </p>
      </div>
      <a
        href={site.slackUrl}
        className="btn btn-primary shrink-0"
        target="_blank"
        rel="noreferrer"
      >
        {site.slackLabel}
      </a>
    </div>
  );
}
