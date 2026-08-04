import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/about", label: "About" },
  { href: "/workouts", label: "Workouts" },
  { href: "/schedule", label: "Schedule" },
  { href: "/join", label: "Join" },
  { href: "/backblasts", label: "Backblasts" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight text-zinc-900">
          {site.name}
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-zinc-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-zinc-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
