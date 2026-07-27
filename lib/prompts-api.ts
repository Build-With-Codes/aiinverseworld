import { AIVERSE_JOBS_BASE_URL } from "@/lib/service-urls";

export type PromptTaxonomy = {
  name: string;
  slug: string;
  count?: number;
};

export type PromptStats = {
  views: number;
  copies: number;
  saves: number;
  likes: number;
  shares?: number;
  weeklyGrowth?: number;
};

export type AiPrompt = {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt: string;
  promptType: string;
  difficulty: string;
  authorName?: string | null;
  sourceUrl?: string | null;
  license?: string | null;
  supportedModels: string[];
  variables?: Record<string, string> | null;
  exampleInput?: Record<string, string> | null;
  exampleOutput?: string | null;
  qualityScore: number;
  readabilityScore: number;
  structureScore: number;
  variablesScore: number;
  reusabilityScore: number;
  featured: boolean;
  trendingScore: number;
  lastUpdatedAt: string;
  categories: PromptTaxonomy[];
  tags: PromptTaxonomy[];
  stats?: PromptStats | null;
};

export type PromptsSearchResult = {
  data: AiPrompt[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PromptsSummary = {
  total: number;
  categories: PromptTaxonomy[];
  models: Array<{ name: string; count: number }>;
  suggestions: string[];
  copies: number;
  saves: number;
  views: number;
};

export type SearchPromptsOptions = {
  q?: string;
  category?: string;
  model?: string;
  difficulty?: string;
  promptType?: string;
  tab?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

function appendDefined(params: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return;
  params.set(key, String(value));
}

export function buildPromptsSearchParams(options: SearchPromptsOptions) {
  const params = new URLSearchParams();
  appendDefined(params, "q", options.q);
  appendDefined(params, "category", options.category);
  appendDefined(params, "model", options.model);
  appendDefined(params, "difficulty", options.difficulty);
  appendDefined(params, "promptType", options.promptType);
  appendDefined(params, "tab", options.tab);
  appendDefined(params, "sort", options.sort);
  appendDefined(params, "page", options.page ?? 1);
  appendDefined(params, "limit", options.limit ?? 12);
  return params;
}

export async function searchPrompts(
  options: SearchPromptsOptions,
  fetchOptions: { revalidate?: number; timeoutMs?: number } = {},
): Promise<PromptsSearchResult> {
  const params = buildPromptsSearchParams(options);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), fetchOptions.timeoutMs ?? 8000);

  try {
    const response = await fetch(`${AIVERSE_JOBS_BASE_URL}/prompts?${params.toString()}`, {
      next: fetchOptions.revalidate !== undefined ? { revalidate: fetchOptions.revalidate } : undefined,
      cache: fetchOptions.revalidate === undefined ? "no-store" : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      return { data: [], meta: { page: options.page ?? 1, limit: options.limit ?? 12, total: 0, totalPages: 1 } };
    }

    return (await response.json()) as PromptsSearchResult;
  } catch {
    return { data: [], meta: { page: options.page ?? 1, limit: options.limit ?? 12, total: 0, totalPages: 1 } };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getPromptsSummary(fetchOptions: { revalidate?: number; timeoutMs?: number } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), fetchOptions.timeoutMs ?? 8000);

  try {
    const response = await fetch(`${AIVERSE_JOBS_BASE_URL}/prompts/stats`, {
      next: fetchOptions.revalidate !== undefined ? { revalidate: fetchOptions.revalidate } : undefined,
      cache: fetchOptions.revalidate === undefined ? "no-store" : undefined,
      signal: controller.signal,
    });

    if (!response.ok) throw new Error("Prompt stats unavailable");
    return (await response.json()) as PromptsSummary;
  } catch {
    return {
      total: 0,
      categories: [],
      models: [],
      suggestions: [],
      copies: 0,
      saves: 0,
      views: 0,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function getPromptBySlug(
  slug: string,
  fetchOptions: { revalidate?: number; timeoutMs?: number } = {},
): Promise<AiPrompt | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), fetchOptions.timeoutMs ?? 8000);

  try {
    const response = await fetch(`${AIVERSE_JOBS_BASE_URL}/prompts/${encodeURIComponent(slug)}`, {
      next: fetchOptions.revalidate !== undefined ? { revalidate: fetchOptions.revalidate } : undefined,
      cache: fetchOptions.revalidate === undefined ? "no-store" : undefined,
      signal: controller.signal,
    });

    if (!response.ok) return null;
    return (await response.json()) as AiPrompt;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function jsonOrNull<T>(promise: Promise<Response>): Promise<T | null> {
  try {
    const response = await promise;
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchSavedPrompts(): Promise<AiPrompt[]> {
  const payload = await jsonOrNull<{ data?: AiPrompt[] }>(
    fetch("/api/me/saved-prompts", { cache: "no-store" }),
  );
  return payload?.data ?? [];
}

export async function savePrompt(promptId: string): Promise<boolean> {
  const payload = await jsonOrNull<{ data?: { saved: boolean } }>(
    fetch("/api/me/saved-prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptId }),
    }),
  );
  return payload?.data?.saved ?? false;
}

export async function unsavePrompt(promptId: string): Promise<boolean> {
  const payload = await jsonOrNull<{ data?: { saved: boolean } }>(
    fetch(`/api/me/saved-prompts?promptId=${encodeURIComponent(promptId)}`, {
      method: "DELETE",
    }),
  );
  return payload?.data?.saved ?? false;
}

const PROMPT_VISITOR_KEY = "aiverse-prompt-visitor-id";

function getPromptVisitorKey() {
  try {
    let key = window.localStorage.getItem(PROMPT_VISITOR_KEY);
    if (!key) {
      key =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      window.localStorage.setItem(PROMPT_VISITOR_KEY, key);
    }
    return key;
  } catch {
    return "anonymous";
  }
}

export type PromptEventType = "copy" | "view" | "share";

function buildPromptEventKey(slug: string, type: PromptEventType, visitorKey: string) {
  if (type === "copy" || type === "share") {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    return `${visitorKey}:${slug}:${type}:${id}`;
  }

  const thirtyMinuteBucket = Math.floor(Date.now() / (30 * 60 * 1000));
  return `${visitorKey}:${slug}:view:${thirtyMinuteBucket}`;
}

export function recordPromptEvent(slug: string, type: PromptEventType): void {
  if (typeof window === "undefined") return;
  try {
    const visitorKey = getPromptVisitorKey();
    const idempotencyKey = buildPromptEventKey(slug, type, visitorKey);

    if (type === "view") {
      const sessionKey = `aiverse-prompt-view:${idempotencyKey}`;
      if (window.sessionStorage.getItem(sessionKey)) return;
      window.sessionStorage.setItem(sessionKey, "1");
    }

    const body = JSON.stringify({ type, visitorKey, idempotencyKey });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `/api/prompts/${encodeURIComponent(slug)}/events`,
        new Blob([body], { type: "application/json" }),
      );
    } else {
      void fetch(`/api/prompts/${encodeURIComponent(slug)}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // Copying a prompt should never fail because analytics failed.
  }
}
