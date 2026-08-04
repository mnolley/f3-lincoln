import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { f3FiveCorePrinciples } from "@/content/copy";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <Header />
      <main className="flex-1">
        <section className="border-b border-zinc-200 bg-zinc-950 text-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">
              {site.city}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-4 text-xl text-zinc-300">{site.tagline}</p>
            <p className="mt-6 max-w-2xl text-lg text-zinc-400">{site.mission}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/join"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
              >
                Join a workout
              </Link>
              <Link
                href="/schedule"
                className="rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-white hover:border-zinc-400"
              >
                See the schedule
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">The five core principles</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {f3FiveCorePrinciples.map((item) => (
              <div key={item.title} className="rounded-2xl border border-zinc-200 p-5">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
