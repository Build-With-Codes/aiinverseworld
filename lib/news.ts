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

type NewsResponse = {
  data: NewsArticle[];
  legal?: {
    summaryOnly: boolean;
    attributionRequired: boolean;
    note: string;
  };
};

export const NEWS_API_BASE_URL =
  process.env.NEWS_API_BASE_URL ?? "http://localhost:3001";

export async function getNewsArticles(limit = 6, category?: string) {
  const searchParams = new URLSearchParams({ limit: String(limit) });

  if (category) {
    searchParams.set("category", category);
  }

  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/api/news?${searchParams.toString()}`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as NewsResponse;
    return payload.data ?? [];
  } catch {
    return [];
  }
}
