import { apiGet } from "@/lib/api-service";
import type {
  AITool,
  CollectionDetail,
  CollectionSummary,
  Spotlight,
} from "@/lib/catalog-types";

// ── Server-side discovery fetchers (public backend endpoints) ────────────
// Used in Server Components. All tolerate backend failure by returning empty.

type DataResponse<T> = { data?: T };

export async function getTrending(
  window: "today" | "7d" | "30d" = "7d",
  limit = 12,
  revalidate?: number,
) {
  const payload = await apiGet<DataResponse<AITool[]>>(
    `/api/tools/trending?window=${window}&limit=${limit}`,
    { revalidate },
  );
  return payload?.data ?? [];
}

export async function getRankings(
  metric: "most-saved" | "most-compared" | "most-searched" = "most-saved",
  limit = 12,
  revalidate?: number,
) {
  const payload = await apiGet<DataResponse<AITool[]>>(
    `/api/tools/rankings?metric=${metric}&limit=${limit}`,
    { revalidate },
  );
  return payload?.data ?? [];
}

export async function getRelatedTools(toolId: string, limit = 6) {
  const payload = await apiGet<DataResponse<AITool[]>>(
    `/api/tools/related/${encodeURIComponent(toolId)}?limit=${limit}`,
  );
  return payload?.data ?? [];
}

export async function getSpotlights(revalidate?: number) {
  const payload = await apiGet<DataResponse<Spotlight[]>>(`/api/tools/spotlights`, { revalidate });
  return payload?.data ?? [];
}

export async function getCollections(revalidate?: number) {
  const payload = await apiGet<DataResponse<CollectionSummary[]>>(
    `/api/tools/collections`,
    { revalidate },
  );
  return payload?.data ?? [];
}

export async function getCollection(slug: string) {
  const payload = await apiGet<DataResponse<CollectionDetail | null>>(
    `/api/tools/collections/${encodeURIComponent(slug)}`,
  );
  return payload?.data ?? null;
}
