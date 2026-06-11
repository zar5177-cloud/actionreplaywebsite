import type { MetadataRoute } from "next";
import { archiveFiles } from "@/data/config/archive-files";
import { drops } from "@/data/drops";
import { landingPages } from "@/data/landing-pages";
import { liveProductSlugs } from "@/lib/brand-data";

const baseUrl = "https://shopactionreplay.com";

const routes = [
  "",
  "/account",
  "/archive",
  ...archiveFiles.map((file) => `/archive/${file.id}`),
  "/cheat-code-streetwear",
  "/codes",
  "/catalog",
  "/drops",
  ...drops.map((drop) => `/drops/${drop.id}`),
  "/go",
  "/missions",
  "/patch-notes",
  ...landingPages.map((page) => `/r/${page.slug}`),
  "/replay-club",
  "/signal-log",
  "/shop",
  "/what-is-action-replay",
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
