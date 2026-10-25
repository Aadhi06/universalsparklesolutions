import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { getSiteUrl, services } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const pages = [
    { path: "", frequency: "weekly" as const, priority: 1 },
    { path: "/services", frequency: "weekly" as const, priority: 0.9 },
    { path: "/blog", frequency: "weekly" as const, priority: 0.8 },
    { path: "/about", frequency: "monthly" as const, priority: 0.7 },
    { path: "/contact", frequency: "monthly" as const, priority: 0.8 },
    { path: "/privacy-policy", frequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", frequency: "yearly" as const, priority: 0.3 },
  ].map((page) => ({
    url: `${base}${page.path}`,
    lastModified: now,
    changeFrequency: page.frequency,
    priority: page.priority,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${base}${service.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(`${post.published}T00:00:00+11:00`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...servicePages, ...guidePages];
}
