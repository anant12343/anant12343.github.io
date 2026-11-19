import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/resume/", label: "Resume" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-site items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight [font-stretch:112%]">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent" />
          ananth<span className="text-muted">.sm</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center">
            {links.map((l, i) => (
              <li key={l.href} className={i === 0 || i === 2 ? "" : "hidden sm:block"}>
                <Link href={l.href} className="rounded-full px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-fg sm:px-3">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
