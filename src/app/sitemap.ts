import type { MetadataRoute } from "next";
import { liveProductSlugs } from "@/lib/brand-data";

const baseUrl = "https://shopactionreplay.com";

const routes = [
  "",
  "/archive",
  "/shop",
  ...liveProductSlugs.map((slug) => `/shop/${slug}`),
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/shop" ? 0.9 : 0.7,
  }));
}
