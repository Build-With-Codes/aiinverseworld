import { apiGet } from "@/lib/api-service";

export type ReviewData = {
  id: string;
  toolId: string;
  userId: string;
  author: string;
  authorImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

export type ReviewDistribution = Record<"1" | "2" | "3" | "4" | "5", number>;

export type ReviewListResult = {
  data: ReviewData[];
  average: number;
  total: number;
  distribution: ReviewDistribution;
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

const emptyResult: ReviewListResult = {
  data: [],
  average: 0,
  total: 0,
  distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
};

export async function getReviews(toolId: string, page = 1, limit = 10): Promise<ReviewListResult> {
  const payload = await apiGet<ReviewListResult>(
    `/api/tools/${encodeURIComponent(toolId)}/reviews?page=${page}&limit=${limit}`,
  );
  return payload ?? emptyResult;
}
