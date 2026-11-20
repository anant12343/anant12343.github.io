import Link from "next/link";
import Bento from "@/components/Bento";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import WorkGrid from "@/components/WorkGrid";
import Showcase from "@/components/Showcase";
import { FeaturedCard } from "@/components/ProjectCard";
import { featuredProjects, projects, toCard } from "@/content/projects";
import { experience } from "@/content/experience";
import { profile, skills, certifications, education, achievements } from "@/content/profile";
import { siteUrl, asset, txt, isTodo } from "@/lib/site";

const wrap = "mx-auto max-w-site px-4 sm:px-6 lg:px-10";

// Card dates: hide unknown ("TODO") dates everywhere, including dev.
const cardDate = (d: string) => (isTodo(d) ? null : txt(d));

const posterProject = projects.find((p) => p.poster);
const showcaseProjects = projects.filter((p) => p.showcase);

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteUrl,
    image: siteUrl + asset("/images/headshot.webp"),
    jobTitle: "PGDM Marketing student",
    alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.institution })),
    sameAs: [profile.links.linkedin],
    knowsAbout: ["Product management", "Growth marketing", "Data analytics", "AI automation"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Bento />

      {/* ── Selected work ───────────────────────────────────────── */}
      <section id="work" aria-labelledby="work-h" className={`${wrap} scroll-mt-20 pt-20 sm:pt-28`}>
        <SectionHeader index="01" id="work-h" title="Selected work" note="Product, automation and data. Four I'd talk about first." />
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {featuredProjects.map((p, i) => (
            <FeaturedCard key={p.slug} p={toCard(p, cardDate(p.date))} index={i} />
          ))}
        </div>

      </section>

      {/* ── Covers & posters (shown in full, no click needed) ───── */}
      <section id="covers" aria-labelledby="covers-h" className={`${wrap} scroll-mt-20 pt-28 sm:pt-40`}>
        <SectionHeader index="02" id="covers-h" title="Covers & posters" note="Decks and print I designed, shown in full. Click any for the case study." />
        <Showcase
          poster={posterProject?.poster ? { slug: posterProject.slug, title: posterProject.title, category: posterProject.category, image: posterProject.poster } : undefined}
          covers={showcaseProjects.map((p) => ({ slug: p.slug, title: p.title, category: p.category, image: p.cover }))}
        />

        <div className="mt-24 sm:mt-32">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h3 className="display text-[clamp(2rem,5vw,3.5rem)]">The full index</h3>
            <span className="label hidden text-muted sm:block">Filter by discipline</span>
          </div>
          <WorkGrid projects={projects.map((p) => toCard(p, cardDate(p.date)))} />
        </div>
      </section>

      {/* ── Experience ──────────────────────────────────────────── */}
      <section id="experience" aria-labelledby="exp-h" className={`${wrap} scroll-mt-20 pt-28 sm:pt-40`}>
        <SectionHeader index="03" id="exp-h" title="Experience" note="Startups, EdTech sales, policy research, content." />
        <ol className="relative">
          {experience.map((e, i) => (
            <li key={e.org + e.role} className="group grid gap-4 border-t border-line py-8 md:grid-cols-[14rem_1fr_auto] md:gap-10 sm:py-10">
              <Reveal y={16} delay={0.03 * i}>
                <p className="label text-muted">{e.period}</p>
                <p className="label mt-2"><span className="rounded-full border border-line px-2 py-0.5">{e.kind}</span></p>
              </Reveal>
              <Reveal y={16} delay={0.03 * i + 0.05}>
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold leading-none tracking-tight [font-stretch:110%]">
                  {e.org}
                  {e.orgNote && <span className="ml-3 align-middle font-sans text-sm font-normal tracking-normal text-muted [font-stretch:100%]">{e.orgNote}</span>}
                </h3>
                <p className="mt-2 text-lg">{e.role}</p>
                <ul className="mt-4 max-w-3xl space-y-2.5 text-[15px] leading-relaxed text-muted">
                  {e.points.map((pt) => (
                    <li key={pt} className="relative pl-5 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-accent">{pt}</li>
                  ))}
                </ul>
              </Reveal>
              <span aria-hidden className="display hidden text-6xl text-line transition-colors duration-500 group-hover:text-accent md:block">{String(i + 1).padStart(2, "0")}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Skills ──────────────────────────────────────────────── */}
      <section id="skills" aria-labelledby="skills-h" className={`${wrap} scroll-mt-20 pt-28 sm:pt-40`}>
        <SectionHeader index="04" id="skills-h" title="Toolkit" note="What I reach for, grouped the way I use it." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(skills).map(([group, items], i) => (
            <Reveal key={group} delay={i * 0.06} className="tile p-6">
              <h3 className="label mb-5 text-muted">{group}</h3>
              <ul className="space-y-2">
                {items.map((s) => (
                  <li key={s} className="border-b border-line pb-2 text-[15px] last:border-0">{s}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-4 tile flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <h3 className="label shrink-0 text-muted">Certifications</h3>
          <ul className="flex flex-wrap gap-2">
            {certifications.map((c) => (
              <li key={c} className="chip">{c}</li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── Education ───────────────────────────────────────────── */}
      <section id="education" aria-labelledby="edu-h" className={`${wrap} scroll-mt-20 pt-28 sm:pt-40`}>
        <SectionHeader index="05" id="edu-h" title="Education" note="Mechanical engineering → data science → marketing." />
        <div className="grid gap-4 md:grid-cols-3">
          {education.map((e, i) => (
            <Reveal key={e.qualification} delay={i * 0.08} className={`tile flex min-h-[16rem] flex-col justify-between p-6 ${i === 0 ? "!bg-fg text-bg !border-fg" : ""}`}>
              <p className="label opacity-70">{e.period}</p>
              <div>
                <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight [font-stretch:108%]">{e.qualification}</h3>
                <p className="mt-2 text-[15px] opacity-80">{e.institution}{e.place ? `, ${e.place}` : ""}</p>
                {e.note && <p className="mt-3 text-sm opacity-60">{e.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-4 grid gap-4 md:grid-cols-2">
          {achievements.map((a) => (
            <div key={a} className="tile flex items-start gap-4 p-6">
              <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-full bg-accent" />
              <p className="text-[15px] leading-relaxed">{a}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── Contact CTA ─────────────────────────────────────────── */}
      <section id="contact" aria-labelledby="contact-h" className={`${wrap} scroll-mt-20 py-28 sm:py-40`}>
        <Reveal>
          <div className="tile overflow-hidden !rounded-[2rem] !border-transparent !bg-accent p-6 text-ink sm:p-10 lg:p-14">
            <p className="label">(06) · Open to roles, graduating 2027</p>
            <h2 id="contact-h" className="display mt-8 text-[clamp(3rem,11vw,10rem)]">
              Let&rsquo;s build<br />something.
            </h2>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a href={`mailto:${profile.email}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 font-medium text-paper transition-transform hover:-translate-y-0.5">
                Email me <span aria-hidden>→</span>
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink px-6 py-3.5 font-medium transition-colors hover:bg-ink hover:text-paper">
                LinkedIn <span aria-hidden>↗</span>
              </a>
              <Link href="/resume/" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink px-6 py-3.5 font-medium transition-colors hover:bg-ink hover:text-paper">
                Resume <span aria-hidden>↗</span>
              </Link>
            </div>
            <p className="mt-8 max-w-md text-sm">Based in {profile.location}. {profile.openTo}.</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
