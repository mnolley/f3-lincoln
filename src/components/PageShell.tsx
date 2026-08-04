import { Header } from "./Header";
import { Footer } from "./Footer";

export function PageShell({
  children,
  title,
  intro,
}: {
  children: React.ReactNode;
  title: string;
  intro?: string;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {intro ? <p className="mt-3 max-w-2xl text-lg text-zinc-600">{intro}</p> : null}
        <div className="mt-8">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
