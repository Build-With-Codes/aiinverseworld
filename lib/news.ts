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

export async function getNewsArticles(limit = 6, category?: string) {
  const searchParams = new URLSearchParams({ limit: String(limit) });

  if (category) {
    searchParams.set("category", category);
  }

  try {
    const response = await fetch(
      `${AIVERSE_WORLD_BASE_URL}/api/news?${searchParams.toString()}`,
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
import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";
