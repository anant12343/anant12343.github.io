"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import type { CardData } from "@/content/projects";
import { asset } from "@/lib/asset";

/** Big featured card: lifts and tilts toward the pointer. */
export function FeaturedCard({ p, index }: { p: CardData; index: number }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
      style={{ perspective: 1200 }}
    >
      <Link href={`/work/${p.slug}/`} className="group block" onPointerMove={onMove} onPointerLeave={reset}>
        <motion.div
          style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          whileHover={reduce ? undefined : { y: -6 }}
          className="tile aspect-[16/10] !rounded-[1.5rem] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(14,14,14,0.35)]"
        >
          <Image
            src={asset(p.cover.src)}
            alt={p.cover.alt}
            fill
            sizes="(min-width:1024px) 44vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
          <span className="label absolute left-4 top-4 rounded-full bg-bg/90 px-2.5 py-1 text-fg backdrop-blur">{String(index + 1).padStart(2, "0")} · {p.category}</span>
        </motion.div>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <h3 className="display text-[clamp(1.9rem,3.4vw,2.9rem)] !leading-[0.95]">{p.title}</h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">{p.tagline}</p>
          </div>
          <span className="chip self-start justify-self-start whitespace-nowrap transition-colors group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
            Case study <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

/** Compact card for the filterable grid. */
export function CompactCard({ p }: { p: CardData }) {
  const date = p.date;
  return (
    <Link href={`/work/${p.slug}/`} className="group block h-full">
      <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="tile flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
          <Image src={asset(p.cover.src.replace("cover.webp", "cover-800.webp"))} alt={p.cover.alt} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none" />
        </div>
        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <div>
            <h3 className="font-display text-xl font-extrabold leading-tight tracking-tight [font-stretch:108%]">{p.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted">{p.tagline}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="label text-muted">
              {p.featured && <span className="mr-2 rounded-full bg-accent px-2 py-0.5 text-ink">Featured</span>}
              {p.category}{date ? ` · ${date}` : ""}
            </span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
