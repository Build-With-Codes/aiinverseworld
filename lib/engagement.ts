import { apiGet, apiGetResult } from "@/lib/api-service";
import type {
  AITool,
  CollectionDetail,
  CollectionSummary,
  Spotlight,
} from "@/lib/catalog-types";
import { getLocalCollection, getLocalCollections } from "@/lib/local-collections-data";

// ── Server-side discovery fetchers (public backend endpoints) ────────────
// Used in Server Components. All tolerate backend failure by returning empty.

type DataResponse<T> = { data?: T };

// None of these have a local fallback (they're analytics/curation-derived —
// real save/compare/search counts, editorial picks — which can't be
// replicated from the static catalog CSV without fabricating numbers). That
// means a backend outage always ends in an empty array here regardless of
// how long we wait, so there's no reason to burn the default 8s timeout
// finding that out — every page renders through SiteShell, which awaits
// several of these in parallel, so a slow failure here was adding several
// real seconds to every single page load for nothing. A short timeout gets
// to the same (empty) result without the wait, and still gives a live
// backend generous room to answer.
const NO_FALLBACK_TIMEOUT_MS = 3000;

export async function getTrending(
  window: "today" | "7d" | "30d" = "7d",
  limit = 12,
  revalidate?: number,
) {
  const payload = await apiGet<DataResponse<AITool[]>>(
    `/api/tools/trending?window=${window}&limit=${limit}`,
    { revalidate, timeoutMs: NO_FALLBACK_TIMEOUT_MS },
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
    { revalidate, timeoutMs: NO_FALLBACK_TIMEOUT_MS },
  );
  return payload?.data ?? [];
}

export async function getRelatedTools(toolId: string, limit = 6) {
  const payload = await apiGet<DataResponse<AITool[]>>(
    `/api/tools/related/${encodeURIComponent(toolId)}?limit=${limit}`,
    { timeoutMs: NO_FALLBACK_TIMEOUT_MS },
  );
  return payload?.data ?? [];
}

export async function getSpotlights(revalidate?: number) {
  const payload = await apiGet<DataResponse<Spotlight[]>>(`/api/tools/spotlights`, {
    revalidate,
    timeoutMs: NO_FALLBACK_TIMEOUT_MS,
  });
  return payload?.data ?? [];
}

export async function getCollections(revalidate?: number) {
  const result = await apiGetResult<DataResponse<CollectionSummary[]>>(
    `/api/tools/collections`,
    { revalidate, timeoutMs: NO_FALLBACK_TIMEOUT_MS },
  );

  if (result.status === "unreachable") {
    return getLocalCollections();
  }

  return result.status === "ok" ? (result.data.data ?? []) : [];
}

export async function getCollection(slug: string) {
  const result = await apiGetResult<DataResponse<CollectionDetail | null>>(
    `/api/tools/collections/${encodeURIComponent(slug)}`,
    { timeoutMs: NO_FALLBACK_TIMEOUT_MS },
  );

  if (result.status === "unreachable") {
    return getLocalCollection(slug);
  }

  return result.status === "ok" ? (result.data.data ?? null) : null;
}
