import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Ad-network creative files (see components/ads/ad-frame.tsx) — never
      // real content, and their own noindex meta only stops indexing, not
      // crawling; this keeps crawlers from fetching them as URLs at all.
      disallow: "/creative/",
    },
    sitemap: "https://aiverseworld.com/sitemap.xml",
  };
}
