import {
  weatherIconEmoji,
  type BeatdownWeather,
} from "@/lib/weather";

type Props = {
  weather?: BeatdownWeather | null;
};

/** Compact forecast chip for a beatdown card (~5:30 AM Central). */
export function WeatherChip({ weather }: Props) {
  if (!weather || weather.tempF == null) {
    return (
      <div className="rounded border border-gloom-border bg-gloom-deep px-2.5 py-1.5 text-[11px] text-ink-dim">
        Weather n/a
      </div>
    );
  }

  return (
    <div
      className="inline-flex max-w-full items-center gap-2 rounded border border-gloom-border bg-gloom-deep px-2.5 py-1.5 text-left"
      title={`${weather.summary} around ${weather.hour} Central`}
    >
      <span className="text-base leading-none" aria-hidden>
        {weatherIconEmoji(weather.icon)}
      </span>
      <div className="min-w-0">
        <p className="font-display text-sm font-bold tabular-nums leading-tight text-white">
          {weather.tempF}°F
        </p>
        <p className="truncate text-[10px] leading-tight text-ink-dim">
          {weather.summary}
          {weather.precipChance != null ? ` · ${weather.precipChance}% rain` : ""}
          {weather.windMph != null ? ` · ${weather.windMph} mph` : ""}
        </p>
      </div>
    </div>
  );
}
