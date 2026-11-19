"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as "light" | "dark") || "light");
  }, []);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch {}
        setTheme(next);
      }}
      aria-label={theme ? `Switch to ${next} mode` : "Toggle colour theme"}
      className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card transition-colors hover:border-fg"
    >
      {/* sun / moon drawn as one disc + mask */}
      <span className="relative block h-4 w-4 overflow-hidden rounded-full bg-fg transition-transform duration-500 group-hover:rotate-45">
        <span className={`absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-card transition-transform duration-500 ${theme === "dark" ? "translate-x-0" : "translate-x-4 -translate-y-4"}`} />
      </span>
    </button>
  );
}
