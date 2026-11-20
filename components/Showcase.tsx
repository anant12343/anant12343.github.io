import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import { asset } from "@/lib/asset";
import type { ImageRef } from "@/content/types";

export type ShowcaseItem = { slug: string; title: string; category: string; image: ImageRef };

/**
 * Home-page wall of the covers and poster you designed: visible in full without clicking.
 * Desktop: poster on the left at full height, covers in a 2-column grid on the right.
 */
export default function Showcase({ poster, covers }: { poster?: ShowcaseItem; covers: ShowcaseItem[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1fr)]">
      {poster && (
        <Reveal className="lg:sticky lg:top-20 lg:self-start">
          <Link href={`/work/${poster.slug}/`} className="group block">
            <figure className="tile !rounded-[1.25rem] bg-white p-2 transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(14,14,14,0.35)] sm:p-3">
              <div className="relative aspect-[1000/1414] overflow-hidden rounded-[0.9rem]">
                <Image src={asset(poster.image.src)} alt={poster.image.alt} fill sizes="(min-width:1024px) 34vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none" />
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-2 pb-1 pt-3 text-ink">
                <span>
                  <span className="label block text-[#5c5952]">Poster · A4</span>
                  <span className="font-display text-lg font-extrabold tracking-tight [font-stretch:108%]">{poster.title}</span>
                </span>
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </figcaption>
            </figure>
          </Link>
        </Reveal>
      )}
      <ul className="grid gap-4 sm:grid-cols-2">
        {covers.map((c, i) => (
          <li key={c.slug}>
            <Reveal delay={(i % 2) * 0.06}>
              <Link href={`/work/${c.slug}/`} className="group block">
                <figure>
                  <div className="tile relative aspect-[16/10] !rounded-[1.25rem] transition-[transform,box-shadow] duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_24px_50px_-20px_rgba(14,14,14,0.4)] motion-reduce:transition-none">
                    <Image src={asset(c.image.src)} alt={c.image.alt} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="font-display text-base font-extrabold leading-tight tracking-tight [font-stretch:108%]">{c.title}</span>
                    <span className="label shrink-0 text-muted">Cover</span>
                  </figcaption>
                </figure>
              </Link>
            </Reveal>
          </li>
        ))}
        <li className="tile flex min-h-[12rem] flex-col justify-between !border-dashed bg-transparent p-6">
          <span className="label text-muted">Designed in-house</span>
          <p className="text-[15px] leading-relaxed">
            Every cover and poster here is my own layout. Click any one for the full case study.
          </p>
          <a href={asset("/files/pocket-scholar-poster.pdf")} download className="label inline-flex items-center gap-2 self-start rounded-full bg-accent px-3 py-2 text-ink">
            Download poster PDF <span aria-hidden>↓</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
