/** Prefix for static assets when deployed under a sub-path (GitHub Pages). Client-safe: imports nothing. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (p: string) => `${basePath}${p}`;
