import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gloom-border bg-gloom-panel safe-bottom">
      <div className="mx-auto grid max-w-6xl gap-8 page-x py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-lg font-bold uppercase tracking-wide text-white">
            {site.name}
          </div>
          <p className="mt-2 text-sm text-ink-muted">{site.tagline}</p>
          <p className="mt-1 text-sm text-ink-dim">{site.city}</p>
          <p className="mt-4 text-sm italic text-ink-muted">&ldquo;{site.motto}&rdquo;</p>
        </div>

        <div>
          <div className="section-label">Navigate</div>
          <ul className="mt-3 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-ink-muted hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="section-label">Pax</div>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <a href={site.exiconUrl} className="hover:text-white" target="_blank" rel="noreferrer">
                Exicon
              </a>
            </li>
            <li>
              <a href={site.lexiconUrl} className="hover:text-white" target="_blank" rel="noreferrer">
                Lexicon
              </a>
            </li>
            <li>
              <a href={site.qSourceUrl} className="hover:text-white" target="_blank" rel="noreferrer">
                Q Source
              </a>
            </li>
            <li>
              <a href={site.gearUrl} className="hover:text-white" target="_blank" rel="noreferrer">
                F3 Gear
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div className="section-label">Nation</div>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <a href={site.nationUrl} className="hover:text-white" target="_blank" rel="noreferrer">
                F3 Nation
              </a>
            </li>
            <li>
              <a
                href={site.nationStartUrl}
                className="hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                Start Here (Nation)
              </a>
            </li>
            <li>
              <a href={site.mapUrl} className="hover:text-white" target="_blank" rel="noreferrer">
                F3 Nation Map
              </a>
            </li>
            <li>
              <a
                href={site.disclaimerUrl}
                className="hover:text-white"
                target="_blank"
                rel="noreferrer"
              >
                Disclaimer &amp; Notice
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gloom-border">
        <div className="mx-auto max-w-6xl page-x py-4 text-xs text-ink-dim">
          © {new Date().getFullYear()} {site.name}. The circle F3 logo is used with the permission of{" "}
          <a href={site.nationUrl} className="underline hover:text-white">
            F3 Nation
          </a>{" "}
          and is a{" "}
          <a href={site.trademarksUrl} className="underline hover:text-white">
            registered trademark of F3 Nation, Inc
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
