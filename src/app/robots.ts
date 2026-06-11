import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/content-lab",
          "/content-lab/",
          "/operator",
          "/operator/",
          "/secret/",
        ],
      },
    ],
    sitemap: "https://shopactionreplay.com/sitemap.xml",
  };
}
