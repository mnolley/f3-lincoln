"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gloom-border bg-gloom-deep/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 page-x py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
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

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-ink-muted hover:bg-gloom hover:text-white"
            >
              {item.label}
            </Link>
          ))}
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
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/new" className="btn btn-primary w-full" onClick={() => setOpen(false)}>
                New to F3? Start Here
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
