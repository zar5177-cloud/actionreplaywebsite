import type { MetadataRoute } from "next";
import { visibleProductSlugs } from "@/lib/brand-data";

const baseUrl = "https://actionreplay.io";

const routes = [
  "",
  "/archive",
  "/archive-log",
  "/hidden-event",
  "/shop",
  ...visibleProductSlugs.map((slug) => `/shop/${slug}`),
  "/forum",
  "/corrupted-file",
  "/manifesto",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/hidden-event" ? 0.9 : 0.7,
  }));
}
