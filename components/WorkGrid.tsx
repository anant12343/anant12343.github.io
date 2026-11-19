"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "@/content/types";
import type { CardData } from "@/content/projects";
import { CompactCard } from "./ProjectCard";

type Filter = "All" | (typeof categories)[number];

export default function WorkGrid({ projects }: { projects: CardData[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const count = (c: Filter) => (c === "All" ? projects.length : projects.filter((p) => p.category === c).length);
  const opts: Filter[] = ["All", ...categories.filter((c) => count(c) > 0)];

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {opts.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`chip shrink-0 transition-colors ${filter === c ? "border-fg bg-fg text-bg" : "bg-card hover:border-fg"}`}
          >
            {c}
            <span className={filter === c ? "opacity-60" : "text-muted"}>{count(c)}</span>
          </button>
        ))}
      </div>
      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <CompactCard p={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
