import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/operator", "/operator/", "/api/", "/secret/"],
      },
    ],
    sitemap: "https://shopactionreplay.com/sitemap.xml",
  };
}
