import { profile } from "@/content/profile";

export { basePath, asset } from "./asset";

export const siteUrl = profile.siteUrl.replace(/\/$/, "");

/**
 * TODO handling.
 *  - `npm run dev`: TODOs render as dashed orange markers so you can see what's missing.
 *  - production build: TODO strings are hidden (whole string if it starts with TODO,
 *    or a trailing "(TODO: …)" segment). Set NEXT_PUBLIC_SHOW_TODOS=1 to show them anyway.
 */
export const SHOW_TODOS =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_TODOS === "1";

export const isTodo = (s?: string) => !s || /^\s*TODO\b/.test(s);
const INLINE = /\s*\(TODO:[^)]*\)/g;

/** Returns display text, or null if it should be hidden. */
export function txt(s?: string): string | null {
  if (!s) return null;
  if (SHOW_TODOS) return s;
  if (isTodo(s)) return null;
  return s.replace(INLINE, "").trim() || null;
}
export const list = (xs: string[] = []) => xs.map(txt).filter((x): x is string => !!x);
