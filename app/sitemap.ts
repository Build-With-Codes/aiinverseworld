import type { MetadataRoute } from "next";

import { categories, comparisons, tools } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aiverseworld.example";
  const staticPages = [
    "",
    "/search",
    "/about",
    "/advertising-disclosure",
    "/affiliate-disclosure",
    "/privacy",
    "/terms",
    "/cookie-policy",
    "/copyright",
    "/disclaimer",
    "/dmca",
    "/security",
    "/contact",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })),
    ...tools.map((tool) => ({
      url: `${baseUrl}/tool/${tool.slug}`,
      lastModified: new Date(),
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
    })),
    ...comparisons.map((comparison) => ({
      url: `${baseUrl}/compare/${comparison.slug}`,
      lastModified: new Date(),
    })),
  ];
}
