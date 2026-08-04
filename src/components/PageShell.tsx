import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({
  children,
  eyebrow,
  title,
  intro,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">
        <div className="border-b border-gloom-border bg-gloom">
          <div className="mx-auto max-w-6xl page-x py-10 sm:py-14">
            {eyebrow ? <p className="section-label mb-3">{eyebrow}</p> : null}
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-5xl">
              {title}
            </h1>
            {intro ? <p className="mt-4 max-w-2xl text-lg text-ink-muted">{intro}</p> : null}
          </div>
        </div>
        <div className="mx-auto max-w-6xl page-x py-10 sm:py-12">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
