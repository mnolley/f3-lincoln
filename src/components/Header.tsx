"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { nav, paxMenu, site, type PaxLink } from "@/lib/site";

function NavLink({
  href,
  children,
  onClick,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`rounded px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-ink-muted hover:bg-gloom hover:text-white ${className}`}
    >
      {children}
    </Link>
  );
}

function PaxItem({
  link,
  onNavigate,
}: {
  link: PaxLink;
  onNavigate?: () => void;
}) {
  const className =
    "block rounded-md px-3 py-2.5 hover:bg-gloom-deep focus:bg-gloom-deep focus:outline-none";

  if (link.external) {
    return (
      <a
        href={link.href}
        className={className}
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-xs font-bold uppercase tracking-wide text-white">
            {link.label}
          </span>
          <span className="text-[10px] text-ink-dim" aria-hidden>
            ↗
          </span>
        </div>
        {link.description ? (
          <p className="mt-0.5 text-xs text-ink-dim">{link.description}</p>
        ) : null}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className} onClick={onNavigate}>
      <span className="font-display text-xs font-bold uppercase tracking-wide text-white">
        {link.label}
      </span>
      {link.description ? (
        <p className="mt-0.5 text-xs text-ink-dim">{link.description}</p>
      ) : null}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [paxOpen, setPaxOpen] = useState(false);
  const [mobilePaxOpen, setMobilePaxOpen] = useState(false);
  const paxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!paxRef.current?.contains(e.target as Node)) {
        setPaxOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setPaxOpen(false);
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const closeAll = () => {
    setOpen(false);
    setPaxOpen(false);
    setMobilePaxOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gloom-border bg-gloom-deep/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 page-x py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeAll}>
          <Image
            src="/brand/F3Lincoln_Logo.png"
            alt="F3 Lincoln"
            width={56}
            height={56}
            className="h-12 w-12 object-contain sm:h-14 sm:w-14"
            priority
          />
          <div className="min-w-0">
            <div className="font-display text-sm font-bold uppercase tracking-[0.12em] text-white sm:text-base">
              {site.name}
            </div>
            <div className="hidden text-xs text-ink-dim sm:block">{site.tagline}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}

          {/* Pax dropdown — F3 Omaha–style resource hub */}
          <div className="relative" ref={paxRef}>
            <button
              type="button"
              className={`rounded px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] transition-colors ${
                paxOpen
                  ? "bg-gloom text-white"
                  : "text-ink-muted hover:bg-gloom hover:text-white"
              }`}
              aria-expanded={paxOpen}
              aria-haspopup="true"
              onClick={() => setPaxOpen((v) => !v)}
            >
              Pax ▾
            </button>

            {paxOpen ? (
              <div
                className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-gloom-border bg-gloom shadow-2xl shadow-black/50"
                role="menu"
              >
                <div className="border-b border-gloom-border bg-gloom-panel px-4 py-3">
                  <p className="font-display text-xs font-bold uppercase tracking-[0.14em] text-f3-red">
                    Pax Menu
                  </p>
                  <p className="mt-1 text-xs text-ink-dim">
                    Tools for HIMs — Lincoln + Nation resources
                  </p>
                </div>
                <div className="max-h-[min(70vh,32rem)] overflow-y-auto p-2">
                  {paxMenu.map((group) => (
                    <div key={group.title} className="mb-2 last:mb-0">
                      <p className="px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim">
                        {group.title}
                      </p>
                      <div className="space-y-0.5">
                        {group.links.map((link) => (
                          <PaxItem
                            key={link.href + link.label}
                            link={link}
                            onNavigate={() => setPaxOpen(false)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {site.slackUrl ? (
                  <div className="border-t border-gloom-border p-3">
                    <a href={site.slackUrl} className="btn btn-primary w-full" target="_blank" rel="noreferrer">
                      {site.slackLabel}
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <Link href="/new" className="btn btn-primary ml-2">
            Start Here
          </Link>
        </nav>

        <button
          type="button"
          className="btn btn-ghost min-h-11 px-3 lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-gloom-border bg-gloom page-x py-3 lg:hidden safe-bottom">
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded px-3 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-ink hover:bg-gloom-deep"
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded px-3 py-3 font-display text-sm font-bold uppercase tracking-[0.12em] text-ink hover:bg-gloom-deep"
                aria-expanded={mobilePaxOpen}
                onClick={() => setMobilePaxOpen((v) => !v)}
              >
                <span>Pax</span>
                <span className="text-ink-dim">{mobilePaxOpen ? "−" : "+"}</span>
              </button>
              {mobilePaxOpen ? (
                <div className="mb-2 ml-2 space-y-3 border-l-2 border-f3-red/40 pl-3">
                  {paxMenu.map((group) => (
                    <div key={group.title}>
                      <p className="px-2 py-1 font-display text-[10px] font-bold uppercase tracking-[0.16em] text-f3-red">
                        {group.title}
                      </p>
                      <div className="space-y-0.5">
                        {group.links.map((link) => (
                          <PaxItem
                            key={link.href + link.label}
                            link={link}
                            onNavigate={closeAll}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </li>

            <li className="pt-2">
              <Link href="/new" className="btn btn-primary w-full" onClick={closeAll}>
                New to F3? Start Here
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
