/** @type {import('next').NextConfig} */
// Static export: `npm run build` writes a plain site to /out (Vercel, GitHub Pages, Netlify…).
// For GitHub Pages under /<repo>, build with NEXT_PUBLIC_BASE_PATH=/<repo>.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  // Images are pre-optimised to WebP by scripts/make-mockups, and static export has no image server.
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
