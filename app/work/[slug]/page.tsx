import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import Reveal from "@/components/Reveal";
import T from "@/components/T";
import { asset, txt, list } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.tagline,
    alternates: { canonical: `/work/${p.slug}/` },
    openGraph: {
      type: "article",
      url: `/work/${p.slug}/`,
      title: p.title,
      description: p.tagline,
      images: [{ url: asset(p.og), width: 1200, height: 630, alt: p.cover.alt }],
    },
    twitter: { card: "summary_large_image", title: p.title, description: p.tagline, images: [asset(p.og)] },
  };
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-10 md:grid-cols-[14rem_1fr] md:gap-10 sm:py-14">
      <h2 className="flex items-baseline gap-3">
        <span className="label text-muted">{n}</span>
        <span className="font-display text-2xl font-extrabold tracking-tight [font-stretch:110%]">{title}</span>
      </h2>
      <div className="max-w-3xl text-lg leading-relaxed">{children}</div>
    </Reveal>
  );
}
const Bullets = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.filter((x) => txt(x)).map((x, i) => (
      <li key={i} className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-2 before:w-2 before:rounded-full before:bg-accent">
        <T s={x} />
      </li>
    ))}
  </ul>
);

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  // Build the numbered sections, skipping any that are empty (e.g. TODO-only in production).
  const sections: { title: string; body: React.ReactNode }[] = [];
  if (txt(p.context)) sections.push({ title: "Context", body: <p><T s={p.context} /></p> });
  if (txt(p.role)) sections.push({ title: "My role", body: <p><T s={p.role} /></p> });
  if (txt(p.problem)) sections.push({ title: "Problem", body: <p><T s={p.problem} /></p> });
  if (list(p.approach).length) sections.push({ title: "Approach", body: <Bullets items={p.approach} /> });
  if (list(p.built).length) sections.push({ title: "What I built", body: <Bullets items={p.built} /> });
  if (list(p.outcome).length) sections.push({ title: "Outcome & learning", body: <Bullets items={p.outcome} /> });
  const tools = list(p.tools);
  if (tools.length)
    sections.push({
      title: "Tools used",
      body: (
        <ul className="flex flex-wrap gap-2">
          {p.tools.map((t, i) => txt(t) && <li key={i} className="chip text-xs"><T s={t} /></li>)}
        </ul>
      ),
    });
  const date = txt(p.date);
  const wrap = "mx-auto max-w-site px-4 sm:px-6 lg:px-10";

  return (
    <article>
      <header className={`${wrap} pt-8 sm:pt-12`}>
        <Link href="/#work" className="label inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
          <span aria-hidden>←</span> All work
        </Link>
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <span className="chip !border-transparent bg-accent text-ink">{p.category}</span>
          {date && <span className="chip"><T s={p.date} /></span>}
          {p.featured && <span className="chip">Featured</span>}
        </div>
        <h1 className="display mt-6 max-w-6xl text-[clamp(2.8rem,9vw,8.5rem)]">{p.title}</h1>
        <p className="mt-6 max-w-3xl text-xl leading-snug text-muted sm:text-2xl">{p.tagline}</p>
        {p.links && p.links.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {p.links.map((l) => {
              const external = l.href.startsWith("http");
              const href = external ? l.href : asset(l.href);
              const isFile = /\.(pdf|zip)$/i.test(l.href);
              return (
                <a
                  key={l.href}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(isFile ? { download: "" } : {})}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 font-medium text-ink transition-transform hover:-translate-y-0.5"
                >
                  {l.label} <span aria-hidden>{isFile ? "↓" : "↗"}</span>
                </a>
              );
            })}
          </div>
        )}
      </header>

      {/* Hero mockup */}
      <div className={`${wrap} mt-10 sm:mt-14`}>
        <div className="rise" style={{ "--i": 1 } as React.CSSProperties}>
          <figure className="tile aspect-[16/10] !rounded-[1.5rem] sm:!rounded-[2rem]">
            <Image src={asset(p.cover.src)} alt={p.cover.alt} fill priority sizes="(min-width:1408px) 1328px, 100vw" className="object-cover" />
          </figure>
        </div>
      </div>

      {/* Key numbers (only figures that are on the resume / screenshots) */}
      {p.stats && p.stats.length > 0 && (
        <div className={`${wrap} mt-4`}>
          <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {p.stats.map((s, k) => (
              <Reveal key={s.label} delay={k * 0.05} className={`tile flex flex-col p-5 sm:p-6 ${k === 0 ? "!border-fg !bg-fg text-bg" : ""}`}>
                <dt className="label order-2 mt-2 opacity-70">{s.label}</dt>
                <dd className="display text-[clamp(2.4rem,5vw,3.8rem)]">{s.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      )}

      <div className={`${wrap} mt-10 sm:mt-16`}>
        {sections.map((s, k) => (
          <Block key={s.title} n={String(k + 1).padStart(2, "0")} title={s.title}>
            {s.body}
          </Block>
        ))}
      </div>

      {/* Gallery */}
      {p.gallery.length > 0 && (
        <section aria-label="Image gallery" className={`${wrap} mt-6 border-t border-line pt-10 sm:pt-14`}>
          <h2 className="label mb-8 text-muted">Gallery · {p.gallery.length} images</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {p.gallery.map((g, k) => (
              <Reveal key={g.src} delay={(k % 2) * 0.06} className={k === 0 && p.gallery.length % 2 === 1 ? "md:col-span-2" : ""}>
                <figure>
                  <div className="tile relative aspect-[16/10]">
                    <Image src={asset(g.src)} alt={g.alt} fill sizes={k === 0 && p.gallery.length % 2 === 1 ? "100vw" : "(min-width:768px) 50vw, 100vw"} className="object-cover" />
                  </div>
                  {g.caption && (
                    <figcaption className="mt-3 flex gap-3 text-sm text-muted">
                      <span className="label">Fig. {String(k + 1).padStart(2, "0")}</span> {g.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Prev / next */}
      <nav aria-label="More projects" className={`${wrap} mt-24 grid gap-4 pb-24 md:grid-cols-2`}>
        {[
          { p: prev, dir: "Previous", arrow: "←" },
          { p: next, dir: "Next", arrow: "→" },
        ].map(({ p: q, dir, arrow }) => (
          <Link key={dir} href={`/work/${q.slug}/`} className={`group tile flex min-h-[12rem] flex-col justify-between p-6 transition-colors hover:!border-fg sm:p-8 ${dir === "Next" ? "md:text-right" : ""}`}>
            <span className="label text-muted">{dir === "Previous" ? `${arrow} ${dir}` : `${dir} ${arrow}`}</span>
            <span className="display text-[clamp(1.8rem,3.5vw,3rem)] transition-colors group-hover:text-accent">{q.title}</span>
          </Link>
        ))}
      </nav>
    </article>
  );
}
