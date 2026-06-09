import type { MetadataRoute } from "next";

import { buildUrl } from "@/lib/seo";
import { categories, comparisons, tools, bestLists } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/best-ai-tools",
    "/free-ai-tools",
    "/ai-productivity-tools",
    "/ai-coding-tools",
    "/ai-writing-tools",
    "/ai-video-tools",
    "/ai-marketing-tools",
    "/compare",
    "/category",
    "/problems",
    "/problems/submit",
    "/games/draw-guess",
    "/news",
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
      url: buildUrl(path || "/"),
      lastModified: new Date(),
    })),
    ...tools.map((tool) => ({
      url: buildUrl(`/tool/${tool.slug}`),
      lastModified: new Date(),
    })),
    ...categories.map((category) => ({
      url: buildUrl(`/category/${category.slug}`),
      lastModified: new Date(),
    })),
    ...comparisons.map((comparison) => ({
      url: buildUrl(`/compare/${comparison.slug}`),
      lastModified: new Date(),
    })),
    ...bestLists.map((list) => ({
      url: buildUrl(`/best/${list.slug}`),
      lastModified: new Date(),
    })),
  ];
}
