import { after } from "next/server";

import type { NewsArticle } from "@/lib/news";
import { fetchImageReadyNewsArticles } from "@/lib/news/fetch";
import { redisDel, redisGet, redisSet, redisSetNx } from "@/lib/trending/redis";

const CACHE_KEY = "news:articles";
const LOCK_KEY = "news:refresh-lock";
const FRESH_MS = 6 * 60 * 60 * 1000;
const LOCK_TTL_SECONDS = 20 * 60;

export type NewsCache = {
  updatedAt: string;
  articles: NewsArticle[];
};

export type NewsResponse = NewsCache & {
  isStale: boolean;
  isRefreshing?: boolean;
  message?: string;
};

function isFresh(updatedAt: string) {
  const timestamp = new Date(updatedAt).getTime();
  return Number.isFinite(timestamp) && Date.now() - timestamp < FRESH_MS;
}

function parseCache(raw: string | null): NewsCache | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as NewsCache;
    if (!Array.isArray(parsed.articles) || !parsed.updatedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function refreshAndStore(): Promise<NewsCache> {
  const articles = await fetchImageReadyNewsArticles();
  if (articles.length === 0) {
    const cached = parseCache(await redisGet(CACHE_KEY).catch(() => null));
    if (cached) return cached;
  }

  const cache = {
    updatedAt: new Date().toISOString(),
    articles,
  };
  if (articles.length > 0) {
    await redisSet(CACHE_KEY, JSON.stringify(cache));
  }
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

function scheduleNewsRefresh() {
  try {
    after(async () => {
      await refreshWithLock();
    });
  } catch {
    void refreshWithLock().catch(() => undefined);
  }
}

export async function getNewsData(): Promise<NewsResponse> {
  const cached = parseCache(await redisGet(CACHE_KEY));

  if (!cached) {
    const token = `${process.pid}-${Date.now()}`;
    const acquired = await redisSetNx(LOCK_KEY, token, LOCK_TTL_SECONDS);
    if (!acquired) {
      return {
        updatedAt: new Date().toISOString(),
        articles: [],
        isStale: true,
        isRefreshing: true,
        message: "AI news is being prepared. Please check back shortly.",
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

  scheduleNewsRefresh();

  return {
    ...cached,
    isStale: true,
    isRefreshing: true,
    message: "AI news is updated regularly from trusted public sources.",
  };
}
