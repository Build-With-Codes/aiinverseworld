import type { Metadata } from "next";

import { StructuredDataScript } from "@/components/structured-data-script";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildUrl, siteName } from "@/lib/seo";
import { getTrendingProjectsData } from "@/lib/trending/refresh";
import { TrendingClient } from "@/app/(site)/trending/trending-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const metadata: Metadata = buildMetadata({
  title: "Trending AI Projects | Open-Source AI Tools & GitHub Projects",
  description:
    "Discover trending open-source AI projects, developer tools, AI agents, LLM frameworks, RAG systems, vision models, voice tools, and data projects gaining momentum.",
  keywords: [
    "trending AI projects",
    "trending open source AI projects",
    "open source AI",
    "GitHub AI projects",
    "best AI GitHub repositories",
    "AI agents",
    "LLM projects",
    "RAG projects",
    "AI developer tools",
    "machine learning projects",
  ],
  robots: {
    index: true,
    follow: true,
    archive: true,
    imageIndex: true,
  },
  canonical: buildUrl("/trending"),
  openGraph: {
    title: "Trending AI Projects | AiverseWorld",
    description:
      "Track high-momentum open-source AI projects across agents, LLMs, RAG, vision, voice, data, and developer tooling.",
    image: buildUrl("/logo.webp"),
    type: "website",
  },
  twitter: {
    title: "Trending AI Projects | AiverseWorld",
    description:
      "Discover open-source AI projects gaining momentum across agents, LLMs, RAG, vision, voice, and developer tools.",
    image: buildUrl("/logo.webp"),
    card: "summary_large_image",
  },
});

export default async function TrendingPage() {
  const data = await getTrendingProjectsData().catch((error) => {
    console.error("[trending-projects] Failed to render trending projects", error);
    return {
      updatedAt: new Date().toISOString(),
      projects: [],
      isStale: true,
      message: "Trending projects are being prepared. Please check back shortly.",
    };
  });

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Trending AI Projects",
      description:
        "A curated radar of trending open-source AI projects across AI agents, LLMs, RAG, vision, voice, data, and developer tooling.",
      url: buildUrl("/trending"),
      isPartOf: {
        "@type": "WebSite",
        name: siteName,
        url: buildUrl("/"),
      },
      publisher: {
        "@type": "Organization",
        name: siteName,
        url: buildUrl("/"),
        logo: buildUrl("/logo.webp"),
      },
      mainEntity: {
        "@type": "ItemList",
        name: "Trending open-source AI projects",
        numberOfItems: data.projects.length,
        itemListElement: data.projects.slice(0, 20).map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.name,
          url: project.url,
          description: project.description,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: buildUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Trending AI Projects",
          item: buildUrl("/trending"),
        },
      ],
    },
  ];

  return (
    <>
      <StructuredDataScript id="trending-ai-projects-schema" data={structuredData} />
      <TrendingClient initialData={data} />
    </>
  );
}
