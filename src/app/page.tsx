import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroMontage } from "@/components/HeroMontage";
import { heroMontageImages } from "@/content/montage";
import { fiveCorePrinciples, site, threeFs } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        {/* Media band — image montage now; set site.heroVideoUrl for video later */}
        <HeroMontage
          images={heroMontageImages}
          videoUrl={site.heroVideoUrl || undefined}
        />

        {/* Hero copy */}
        <section className="relative overflow-hidden border-b border-gloom-border bg-gloom-panel">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at top, rgba(220,38,38,0.25), transparent 55%), linear-gradient(180deg, #111827 0%, #0b1220 100%)",
            }}
          />
          <div className="relative mx-auto grid max-w-6xl gap-10 page-x py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="section-label">{site.city}</p>
              <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-wide text-white sm:text-6xl">
                {site.name}
              </h1>
              <p className="mt-3 font-display text-lg font-semibold uppercase tracking-[0.18em] text-f3-red sm:text-xl">
                {site.tagline}
              </p>
              <p className="mt-6 max-w-xl text-lg text-ink-muted">{site.mission}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/new" className="btn btn-primary">
                  New to F3? Start Here
                </Link>
                <Link href="/locations" className="btn btn-outline">
                  Find a Workout
                </Link>
              </div>
              <p className="mt-6 text-sm italic text-ink-dim">&ldquo;{site.motto}&rdquo;</p>
              {site.twitterUrl ? (
                <p className="mt-4 text-sm text-ink-dim">
                  Follow the gloom on{" "}
                  <a
                    href={site.twitterUrl}
                    className="font-display text-xs font-bold uppercase tracking-wide text-f3-red hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {site.twitterHandle} ↗
                  </a>
                </p>
              ) : null}
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="card-panel flex w-full max-w-xl flex-col items-center p-4 sm:max-w-2xl sm:p-6">
                <Image
                  src="/brand/F3_new_logo.png"
                  alt="F3 Lincoln logo"
                  width={1200}
                  height={1200}
                  className="h-[22rem] w-[22rem] object-contain sm:h-[28rem] sm:w-[28rem] lg:h-[32rem] lg:w-[32rem]"
                  sizes="(max-width: 640px) 352px, (max-width: 1024px) 448px, 512px"
                  priority
                />
                <p className="mt-5 text-center text-sm text-ink-dim">
                  Free · Outdoor · Peer-led · Always ends with a COT
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Fs */}
        <section className="border-b border-gloom-border bg-gloom">
          <div className="mx-auto max-w-6xl page-x py-14">
            <p className="section-label">The Three F&apos;s</p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase text-white sm:text-3xl">
              Why men keep posting
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {threeFs.map((item) => (
                <div key={item.title} className="card-panel p-6">
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide text-f3-red">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5 Principles */}
        <section className="border-b border-gloom-border bg-gloom-deep">
          <div className="mx-auto max-w-6xl page-x py-14">
            <p className="section-label">Non-negotiables</p>
            <h2 className="mt-2 font-display text-2xl font-bold uppercase text-white sm:text-3xl">
              Five Core Principles
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fiveCorePrinciples.map((item) => (
                <div key={item.title} className="card-panel flex gap-4 p-5">
                  <Image
                    src={item.icon}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 object-contain"
                  />
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase tracking-wide text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="bg-f3-red">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 page-x py-10 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-white sm:text-3xl">
                Ready for the Gloom?
              </h2>
              <p className="mt-2 text-white/90">
                No signup. No fees. Pick an AO and show up five minutes early.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/new"
                className="btn bg-white text-f3-red hover:bg-ink"
              >
                Start Here
              </Link>
              <Link href="/locations" className="btn btn-outline border-white text-white hover:bg-white hover:text-f3-red">
                Locations
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
