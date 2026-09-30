import { apiGet, apiGetResult } from "@/lib/api-service";
import type {
  AITool,
  CollectionDetail,
  CollectionSummary,
  Spotlight,
} from "@/lib/catalog-types";
import { getLocalCollection, getLocalCollections } from "@/lib/local-collections-data";
import { getLocalSpotlights, getLocalTrendingTools } from "@/lib/local-tools-data";

// ── Server-side discovery fetchers (public backend endpoints) ────────────
// Used in Server Components. All tolerate backend failure by returning empty.

type DataResponse<T> = { data?: T };

// getRankings/getRelatedTools have no local fallback (real per-user
// save/compare/search counts and real similarity data — nothing to
// reconstruct from the static catalog CSV). getTrending/getSpotlights below
// DO fall back now (to real popularity/rating rank, honestly labeled as
// that rather than claiming to be true analytics or editorial curation) —
// see lib/local-tools-data.ts. None of this changes the timeout logic: a
// short timeout still matters for getRankings/getRelatedTools since they can
// never do better than empty on a backend outage regardless of how long we
// wait.
const NO_FALLBACK_TIMEOUT_MS = 3000;

export async function getTrending(
  window: "today" | "7d" | "30d" = "7d",
  limit = 12,
  revalidate?: number,
) {
  const result = await apiGetResult<DataResponse<AITool[]>>(
    `/api/tools/trending?window=${window}&limit=${limit}`,
    { revalidate, timeoutMs: NO_FALLBACK_TIMEOUT_MS },
  );

  if (result.status === "unreachable") {
    return getLocalTrendingTools(limit);
  }

  return result.status === "ok" ? (result.data.data ?? []) : [];
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
  const result = await apiGetResult<DataResponse<Spotlight[]>>(`/api/tools/spotlights`, {
    revalidate,
    timeoutMs: NO_FALLBACK_TIMEOUT_MS,
  });

  if (result.status === "unreachable") {
    return getLocalSpotlights();
  }

  return result.status === "ok" ? (result.data.data ?? []) : [];
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
