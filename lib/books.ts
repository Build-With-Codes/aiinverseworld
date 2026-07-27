import { apiGet } from "@/lib/api-service";

export type RecommendedBook = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  author: string;
  description: string;
  isbn13?: string | null;
  coverUrl?: string | null;
  buyUrl: string;
  previewLink?: string | null;
  merchant: string;
  affiliateEnabled: boolean;
  averageRating?: number | null;
  ratingsCount?: number | null;
  publishedDate?: string | null;
  score: number;
  reason: string;
};

type BooksResponse = {
  data?: RecommendedBook[];
};

export async function getBookRecommendations(input: {
  type: "tool" | "blog";
  key: string;
  limit?: number;
}) {
  const params = new URLSearchParams({
    type: input.type,
    key: input.key,
    limit: String(input.limit ?? 4),
  });

  const payload = await apiGet<BooksResponse>(`/api/books/recommendations?${params.toString()}`, {
    timeoutMs: 6000,
  });

  return payload?.data ?? [];
}
