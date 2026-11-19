import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl, basePath } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl + basePath;
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/resume/`, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}/`, changeFrequency: "yearly" as const, priority: p.featured ? 0.9 : 0.6 })),
  ];
}
