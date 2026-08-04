import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-zinc-600">
        <p className="font-medium text-zinc-900">{site.name}</p>
        <p className="mt-1">{site.tagline}</p>
        <p className="mt-1">{site.city}</p>
        <p className="mt-4 text-xs text-zinc-500">
          F3 is a national network of free, peer-led workouts for men. This site is for the{" "}
          {site.region} region.
        </p>
      </div>
    </footer>
  );
}
