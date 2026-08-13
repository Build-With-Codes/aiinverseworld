import { getNewsData } from "@/lib/news/refresh";

export type NewsArticle = {
  id: string;
  slug: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  summary: string;
  keyPoints: string[];
  category: string;
  imageUrl: string;
  publishedAt: string;
  processedAt: string;
  legal: {
    attributionRequired: boolean;
    copyrightOwner: string;
    summaryOnly: boolean;
    takedownEmail: string;
  };
};

export async function getNewsArticles(limit = 6, category?: string, revalidate?: number) {
  const data = await getNewsData().catch((error) => {
    console.error("[news] Failed to load news cache", error);
    return { articles: [] };
  });

  const articles = category
    ? data.articles.filter((article) => article.category.toLowerCase() === category.toLowerCase())
    : data.articles;

  return articles.slice(0, limit);
}
