import { profile } from "@/content/profile";
import { txt } from "@/lib/site";

export default function Footer() {
  const github = txt(profile.links.github);
  const items = [
    { label: "Email", href: `mailto:${profile.email}`, text: profile.email },
    { label: "LinkedIn", href: profile.links.linkedin, text: "in/ananthsm2" },
    ...(github ? [{ label: "GitHub", href: github.startsWith("http") ? github : "#", text: github }] : []),
  ];
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-site gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-10">
        <div>
          <p className="display text-4xl sm:text-5xl">ananth<span className="text-accent">.</span></p>
          <p className="label mt-3 text-muted">© {new Date().getFullYear()} {profile.name}</p>
        </div>
        <ul className="flex flex-col gap-2 md:items-end">
          {items.map((i) => (
            <li key={i.label} className="flex items-baseline gap-3">
              <span className="label text-muted">{i.label}</span>
              <a href={i.href} className="break-all underline decoration-line underline-offset-4 transition-colors hover:decoration-accent">
                {i.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
