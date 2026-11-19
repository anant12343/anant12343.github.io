import Image from "next/image";
import Link from "next/link";
import { profile, heroStack } from "@/content/profile";
import { asset, txt } from "@/lib/site";
import { projects, featuredProjects } from "@/content/projects";
import Clock from "./Clock";

/** Tiles rise in with a CSS stagger (runs at first paint, no JS needed, so it never delays LCP). */
const Tile = ({ i, className = "", children }: { i: number; className?: string; children: React.ReactNode }) => (
  <div className={`tile p-5 sm:p-6 ${i >= 0 ? "rise" : ""} ${className}`} style={{ "--i": i } as React.CSSProperties}>
    {children}
  </div>
);

export default function Bento() {
  const github = txt(profile.links.github);
  return (
    <section aria-label="Introduction" className="mx-auto max-w-site px-4 pb-6 pt-4 sm:px-6 sm:pt-6 lg:px-10">
      <div
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[minmax(13rem,auto)_minmax(13rem,auto)_auto]"
      >
        {/* Intro */}
        <Tile i={0} className="dot-grid col-span-2 flex min-h-[22rem] flex-col justify-between lg:row-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="label text-muted">PGDM Marketing · BIMTECH · 2025–27</span>
          </div>
          <div>
            <h1 className="display text-[clamp(3.2rem,9vw,7.2rem)]">
              Hi, I&rsquo;m <span className="relative whitespace-nowrap">Ananth<span aria-hidden className="text-accent">.</span></span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-snug sm:text-xl">
              Engineer <span aria-hidden className="text-muted">→</span> data person <span aria-hidden className="text-muted">→</span> marketer{" "}
              <mark className="bg-accent px-1 text-ink">who builds things.</mark>
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Focus areas">
              {profile.focus.map((f) => (
                <li key={f} className="chip bg-bg">{f}</li>
              ))}
            </ul>
          </div>
        </Tile>

        {/* Headshot */}
        <Tile i={1} className="group row-span-2 !p-0 min-h-[17rem]">
          <Image
            src={asset("/images/headshot.webp")}
            alt={`Portrait of ${profile.name} in a dark suit and glasses`}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width:1024px) 22vw, 50vw"
            className="object-cover object-top grayscale transition duration-700 group-hover:grayscale-0 motion-reduce:transition-none"
          />
          <span className="label absolute bottom-3 left-3 whitespace-nowrap rounded-full bg-bg/85 px-2.5 py-1 backdrop-blur">Greater Noida<span className="hidden sm:inline">, IN</span></span>
        </Tile>

        {/* Status */}
        <Tile i={2} className="flex flex-col justify-between">
          <span className="label text-muted">Currently</span>
          <div>
            <p className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
              </span>
              <span className="display text-[clamp(1.6rem,3vw,2.2rem)]">{profile.status.label}</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              {profile.status.detail}. {profile.openTo}.
            </p>
          </div>
        </Tile>

        {/* Clock */}
        <Tile i={3} className="col-span-1 min-h-[11rem]">
          <Clock />
        </Tile>

        {/* Stack */}
        <Tile i={4} className="col-span-2 flex flex-col justify-between gap-4 lg:col-span-1">
          <span className="label text-muted">Stack</span>
          <ul className="flex flex-wrap gap-1.5">
            {heroStack.map((s) => (
              <li key={s} className="rounded-md bg-bg px-2 py-1 font-mono text-xs">{s}</li>
            ))}
          </ul>
        </Tile>

        {/* View my work */}
        <a
          href="#work"
          style={{ "--i": 5 } as React.CSSProperties}
          className="group tile rise col-span-2 transition-transform duration-300 hover:-translate-y-1 flex min-h-[10rem] items-end justify-between !border-transparent !bg-accent p-5 text-ink sm:p-6"
        >
          <span>
            <span className="label block">{projects.length} projects · {featuredProjects.length} featured</span>
            <span className="display mt-2 block text-[clamp(2.4rem,5vw,4rem)]">View my work</span>
          </span>
          <span aria-hidden className="display text-[clamp(2.4rem,5vw,4rem)] transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1">↘</span>
        </a>

        {/* Contact */}
        <Tile i={6} className="col-span-2 flex flex-col justify-between gap-4 lg:col-span-1">
          <span className="label text-muted">Say hello</span>
          <ul className="space-y-1.5 text-[15px]">
            <li><a className="group flex justify-between hover:underline" href={`mailto:${profile.email}`}>Email <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span></a></li>
            <li><a className="group flex justify-between hover:underline" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden>↗</span></a></li>
            {github && <li><a className="group flex justify-between hover:underline" href={github}>GitHub <span aria-hidden>↗</span></a></li>}
            <li><Link className="group flex justify-between hover:underline" href="/resume/">Resume <span aria-hidden>↗</span></Link></li>
          </ul>
        </Tile>
      </div>
    </section>
  );
}
