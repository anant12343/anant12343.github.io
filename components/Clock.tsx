"use client";
import { useEffect, useState } from "react";

const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", ...opts }).format(d);

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hm = now ? fmt(now, { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--";
  const s = now ? fmt(now, { second: "2-digit" }).padStart(2, "0") : "--";
  const day = now ? fmt(now, { weekday: "short", day: "numeric", month: "short" }) : " ";
  const h = now ? Number(fmt(now, { hour: "numeric", hour12: false })) : 12;
  const awake = h >= 8 && h < 23;
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="label text-muted"><span className="hidden sm:inline">Local time · </span>IST</span>
        <span className="label text-muted">UTC+5:30</span>
      </div>
      <div>
        <p className="display whitespace-nowrap tabular-nums text-[clamp(2.1rem,9vw,3rem)] lg:text-[clamp(2.4rem,3.4vw,3.6rem)]" aria-live="off">
          <time dateTime={now?.toISOString()} suppressHydrationWarning>
            {hm}
            <span className="text-[0.55em] text-muted">:{s}</span>
          </time>
        </p>
        <p className="mt-2 font-mono text-xs text-muted" suppressHydrationWarning>
          {day} · {awake ? "probably awake" : "probably asleep, replies by morning"}
        </p>
      </div>
    </div>
  );
}
