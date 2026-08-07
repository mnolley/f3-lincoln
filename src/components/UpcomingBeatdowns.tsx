import Link from "next/link";
import { WeatherChip } from "@/components/WeatherChip";
import { formatUpcomingWhen, type UpcomingBeatdown } from "@/lib/schedule";
import { site } from "@/lib/site";
import type { BeatdownWeather } from "@/lib/weather";

type Props = {
  slots: UpcomingBeatdown[];
  error?: string;
  weatherByYmd?: Map<string, BeatdownWeather>;
};

export function UpcomingBeatdowns({ slots, error, weatherByYmd }: Props) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-label">Coming up</p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            Next three beatdowns
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            From the Sparta schedule (Mon / Wed / Fri). Q is filled when Paxminer
            has a claim in Slack; otherwise the slot is open. Weather is the
            ~5:30 AM forecast for Lincoln.
          </p>
        </div>
        {site.slackUrl ? (
          <a
            href={site.slackUrl}
            className="btn btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            Claim a Q in Slack
          </a>
        ) : null}
      </div>

      {error ? (
        <div className="card-panel border-gloom-border p-4 text-xs text-ink-dim">
          {error}
        </div>
      ) : null}

      {slots.length === 0 ? (
        <div className="card-panel p-8 text-center text-sm text-ink-muted">
          No upcoming workouts found on the schedule.
        </div>
      ) : (
        <ol className="grid gap-4 lg:grid-cols-3">
          {slots.map((slot, i) => {
            const weather = weatherByYmd?.get(slot.ymd);
            return (
              <li
                key={`${slot.ymd}-${slot.ao}`}
                className="card-panel flex flex-col p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-f3-red">
                      #{i + 1}
                    </span>
                    <span className="rounded bg-gloom-deep px-2 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-ink-dim">
                      {slot.style}
                    </span>
                  </div>
                  <WeatherChip weather={weather} />
                </div>

                <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-wide text-white">
                  {slot.ao}
                </h3>
                <p className="mt-2 text-sm text-ink">
                  {formatUpcomingWhen(slot)}
                </p>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-3 border-t border-gloom-border pt-2">
                    <dt className="text-ink-dim">Q</dt>
                    <dd className="text-right font-medium text-ink">
                      {slot.qic ? (
                        slot.qic
                      ) : (
                        <span className="text-f3-red">Open — claim in Slack</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-gloom-border pt-2">
                    <dt className="text-ink-dim">Time</dt>
                    <dd className="text-right text-ink">{slot.time}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-gloom-border pt-2">
                    <dt className="text-ink-dim">Meet</dt>
                    <dd className="text-right text-ink">
                      <a
                        href={slot.mapUrl}
                        className="underline decoration-gloom-border underline-offset-2 hover:text-white"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Map ↗
                      </a>
                    </dd>
                  </div>
                  {slot.title && slot.title !== slot.ao ? (
                    <div className="flex justify-between gap-3 border-t border-gloom-border pt-2">
                      <dt className="text-ink-dim">Preblast</dt>
                      <dd className="text-right text-ink-muted">{slot.title}</dd>
                    </div>
                  ) : null}
                </dl>

                {slot.preRun ? (
                  <p className="mt-4 text-xs text-ink-dim">
                    Optional pre-run: {slot.preRun.split("—")[0]?.trim()}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}

      <p className="text-xs text-ink-dim">
        Always double-check Q claims in Slack via Paxminer — last-minute
        audibles happen. Weather via Open-Meteo for Lincoln.{" "}
        <Link href="/backblasts" className="text-f3-red hover:underline">
          Recent backblasts →
        </Link>
      </p>
    </section>
  );
}
