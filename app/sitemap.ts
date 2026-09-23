import type { MetadataRoute } from "next";
import { getSiteUrl, services } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const pages = [
    "",
    "/about",
    "/services",
    "/contact",
    "/privacy-policy",
    "/terms",
    ...services.map((service) => service.href),
  ];

  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
