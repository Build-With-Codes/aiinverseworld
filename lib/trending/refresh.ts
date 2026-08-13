import { after } from "next/server";

import { fetchTrendingProjectsFromGitHub } from "@/lib/trending/github";
import { redisDel, redisGet, redisSet, redisSetNx } from "@/lib/trending/redis";
import type { TrendingProjectsCache, TrendingProjectsResponse } from "@/lib/trending/types";

const CACHE_KEY = "trending:ai-projects";
const LOCK_KEY = "trending:ai-projects:refresh-lock";
const FRESH_MS = 48 * 60 * 60 * 1000;
const LOCK_TTL_SECONDS = 20 * 60;

function isFresh(updatedAt: string) {
  const timestamp = new Date(updatedAt).getTime();
  return Number.isFinite(timestamp) && Date.now() - timestamp < FRESH_MS;
}

function parseCache(raw: string | null): TrendingProjectsCache | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as TrendingProjectsCache;
    if (!Array.isArray(parsed.projects) || !parsed.updatedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function refreshAndStore(): Promise<TrendingProjectsCache> {
  const projects = await fetchTrendingProjectsFromGitHub();
  const cache = {
    updatedAt: new Date().toISOString(),
    projects,
  };
  await redisSet(CACHE_KEY, JSON.stringify(cache));
  return cache;
}

async function refreshWithLock() {
  const token = `${process.pid}-${Date.now()}`;
  const acquired = await redisSetNx(LOCK_KEY, token, LOCK_TTL_SECONDS);
  if (!acquired) return false;

  try {
    await refreshAndStore();
    return true;
  } finally {
    const currentToken = await redisGet(LOCK_KEY).catch(() => null);
    if (currentToken === token) {
      await redisDel(LOCK_KEY).catch(() => undefined);
    }
  }
}

export async function startTrendingRefresh() {
  await refreshWithLock();
}

function scheduleTrendingRefresh() {
  try {
    after(async () => {
      await refreshWithLock();
    });
  } catch {
    void refreshWithLock().catch(() => undefined);
  }
}

export async function getTrendingProjectsData(): Promise<TrendingProjectsResponse> {
  const cached = parseCache(await redisGet(CACHE_KEY));

  if (!cached) {
    const token = `${process.pid}-${Date.now()}`;
    const acquired = await redisSetNx(LOCK_KEY, token, LOCK_TTL_SECONDS);
    if (!acquired) {
      return {
        updatedAt: new Date().toISOString(),
        projects: [],
        isStale: true,
        isRefreshing: true,
        message: "Trending projects are being prepared. Please check back shortly.",
      };
    }

    try {
      const fresh = await refreshAndStore();
      return { ...fresh, isStale: false };
    } finally {
      const currentToken = await redisGet(LOCK_KEY).catch(() => null);
      if (currentToken === token) {
        await redisDel(LOCK_KEY).catch(() => undefined);
      }
    }
  }

  if (isFresh(cached.updatedAt)) {
    return { ...cached, isStale: false };
  }

  scheduleTrendingRefresh();

  return {
    ...cached,
    isStale: true,
    isRefreshing: true,
    message: "Project momentum is updated regularly from public signals.",
  };
}
