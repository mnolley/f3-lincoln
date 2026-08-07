/** Open-Meteo forecast helpers for Lincoln, NE beatdowns (no API key). */

export const LINCOLN_LAT = 40.8258;
export const LINCOLN_LON = -96.6852;

export type BeatdownWeather = {
  /** YYYY-MM-DD */
  ymd: string;
  /** e.g. 62 */
  tempF: number | null;
  /** e.g. 45 */
  precipChance: number | null;
  /** e.g. 8 */
  windMph: number | null;
  /** Human label */
  summary: string;
  /** Short icon key */
  icon: "clear" | "cloud" | "fog" | "rain" | "snow" | "storm" | "unknown";
  /** Hour used, e.g. "05:00" */
  hour: string;
};

/** WMO weather interpretation codes → short summary + icon. */
function interpretWmo(code: number | null | undefined): {
  summary: string;
  icon: BeatdownWeather["icon"];
} {
  if (code == null || Number.isNaN(code)) {
    return { summary: "Forecast n/a", icon: "unknown" };
  }
  if (code === 0) return { summary: "Clear", icon: "clear" };
  if (code === 1) return { summary: "Mostly clear", icon: "clear" };
  if (code === 2) return { summary: "Partly cloudy", icon: "cloud" };
  if (code === 3) return { summary: "Overcast", icon: "cloud" };
  if (code === 45 || code === 48) return { summary: "Fog", icon: "fog" };
  if (code >= 51 && code <= 67) return { summary: "Drizzle / rain", icon: "rain" };
  if (code >= 71 && code <= 77) return { summary: "Snow", icon: "snow" };
  if (code >= 80 && code <= 82) return { summary: "Showers", icon: "rain" };
  if (code >= 85 && code <= 86) return { summary: "Snow showers", icon: "snow" };
  if (code >= 95) return { summary: "Thunderstorm", icon: "storm" };
  return { summary: "Mixed", icon: "cloud" };
}

type OpenMeteoHourly = {
  time: string[];
  temperature_2m?: (number | null)[];
  precipitation_probability?: (number | null)[];
  weather_code?: (number | null)[];
  wind_speed_10m?: (number | null)[];
};

type OpenMeteoResponse = {
  hourly?: OpenMeteoHourly;
};

/**
 * Fetch hourly forecast for Lincoln and pick conditions near 5:30 AM
 * Central for each YYYY-MM-DD in `ymds`.
 */
export async function fetchBeatdownWeather(
  ymds: string[]
): Promise<Map<string, BeatdownWeather>> {
  const unique = [...new Set(ymds.filter(Boolean))];
  const out = new Map<string, BeatdownWeather>();
  if (!unique.length) return out;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(LINCOLN_LAT));
  url.searchParams.set("longitude", String(LINCOLN_LON));
  url.searchParams.set(
    "hourly",
    "temperature_2m,precipitation_probability,weather_code,wind_speed_10m"
  );
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("timezone", "America/Chicago");
  url.searchParams.set("forecast_days", "16");

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 1800 }, // 30 min
    });
    if (!res.ok) {
      for (const ymd of unique) {
        out.set(ymd, emptyWeather(ymd));
      }
      return out;
    }

    const data = (await res.json()) as OpenMeteoResponse;
    const hourly = data.hourly;
    if (!hourly?.time?.length) {
      for (const ymd of unique) out.set(ymd, emptyWeather(ymd));
      return out;
    }

    for (const ymd of unique) {
      // Prefer 05:00 or 06:00 local (covers 5:30 start)
      const idx =
        hourly.time.findIndex((t) => t === `${ymd}T05:00`) >= 0
          ? hourly.time.findIndex((t) => t === `${ymd}T05:00`)
          : hourly.time.findIndex((t) => t === `${ymd}T06:00`) >= 0
            ? hourly.time.findIndex((t) => t === `${ymd}T06:00`)
            : hourly.time.findIndex((t) => t.startsWith(`${ymd}T`));

      if (idx < 0) {
        out.set(ymd, emptyWeather(ymd));
        continue;
      }

      const code = hourly.weather_code?.[idx] ?? null;
      const { summary, icon } = interpretWmo(code ?? undefined);
      const temp = hourly.temperature_2m?.[idx];
      const precip = hourly.precipitation_probability?.[idx];
      const wind = hourly.wind_speed_10m?.[idx];
      const hour = hourly.time[idx]?.split("T")[1]?.slice(0, 5) ?? "05:00";

      out.set(ymd, {
        ymd,
        tempF: typeof temp === "number" ? Math.round(temp) : null,
        precipChance: typeof precip === "number" ? Math.round(precip) : null,
        windMph: typeof wind === "number" ? Math.round(wind) : null,
        summary,
        icon,
        hour,
      });
    }
  } catch {
    for (const ymd of unique) out.set(ymd, emptyWeather(ymd));
  }

  return out;
}

function emptyWeather(ymd: string): BeatdownWeather {
  return {
    ymd,
    tempF: null,
    precipChance: null,
    windMph: null,
    summary: "Forecast n/a",
    icon: "unknown",
    hour: "05:00",
  };
}

export function weatherIconEmoji(icon: BeatdownWeather["icon"]): string {
  switch (icon) {
    case "clear":
      return "☀️";
    case "cloud":
      return "☁️";
    case "fog":
      return "🌫️";
    case "rain":
      return "🌧️";
    case "snow":
      return "❄️";
    case "storm":
      return "⛈️";
    default:
      return "🌡️";
  }
}
