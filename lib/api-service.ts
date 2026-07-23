import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

type ApiGetOptions = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  /** Max time to wait for the backend before giving up gracefully. Defaults to 8s —
   * comfortably under typical serverless function timeouts, so a slow/cold backend
   * fails inside our own try/catch instead of getting the whole request killed by
   * the hosting platform (which would bypass our fallback data entirely). */
  timeoutMs?: number;
};

// One retry on a genuinely dropped connection (not on 4xx/5xx, and not on our
// own timeout) — covers the single flaky request without doubling latency on
// every call.
function isRetryableNetworkError(error: unknown) {
  return (
    error instanceof TypeError ||
    (error instanceof Error && error.name === "AggregateError")
  );
}

export async function apiGet<T>(path: string, options: ApiGetOptions = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${AIVERSE_WORLD_BASE_URL}${normalizedPath}`;
  const timeoutMs = options.timeoutMs ?? 8000;

  async function attempt(): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, {
        cache: options.cache ?? "no-store",
        next: options.next,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  try {
    let response: Response;
    try {
      response = await attempt();
    } catch (error) {
      if (isRetryableNetworkError(error)) {
        response = await attempt();
      } else {
        throw error;
      }
    }

    if (!response.ok) {
      console.warn(
        `[api-service] ${normalizedPath} returned ${response.status} ${response.statusText}`,
      );
      return undefined;
    }

    return (await response.json()) as T;
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? `timed out after ${timeoutMs}ms`
        : error instanceof Error
          ? error.message
          : "unknown error";
    console.warn(`[api-service] ${normalizedPath} failed: ${reason}`);
    return undefined;
  }
}
