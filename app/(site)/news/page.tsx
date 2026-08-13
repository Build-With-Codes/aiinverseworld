import type { Metadata } from "next";

import { NewsClient } from "@/app/(site)/news/news-client";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildUrl } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { getNewsData } from "@/lib/news/refresh";
import { getRouteSeo } from "@/services/seo.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const metadata: Metadata = buildMetadata(getRouteSeo("/news"));

export default async function NewsPage() {
  const news = await getNewsData().catch((error) => {
    console.error("[news] Failed to render news page", error);
    return {
      updatedAt: new Date().toISOString(),
      articles: [],
      isStale: true,
      message: "AI news is being prepared. Please check back shortly.",
    };
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AiverseWorld AI News",
    url: buildUrl("/news"),
    hasPart: news.articles.slice(0, 20).map((article) => ({
      "@type": "NewsArticle",
      headline: article.title,
      datePublished: article.publishedAt,
      dateModified: article.processedAt,
      image: article.imageUrl,
      url: article.sourceUrl,
      publisher: {
        "@type": "Organization",
        name: article.sourceName,
      },
    })),
  };

  return (
    <>
      <StructuredDataScript id="news-schema" data={structuredData} />
      <NewsClient articles={news.articles} updatedAt={news.updatedAt} message={news.message} />
    </>
  );
}
