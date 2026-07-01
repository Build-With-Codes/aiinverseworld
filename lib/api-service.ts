import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

type ApiGetOptions = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function apiGet<T>(path: string, options: ApiGetOptions = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${AIVERSE_WORLD_BASE_URL}${normalizedPath}`;

  try {
    const response = await fetch(url, {
      cache: options.cache ?? "no-store",
      next: options.next,
    });

    if (!response.ok) {
      console.warn(
        `[api-service] ${normalizedPath} returned ${response.status} ${response.statusText}`,
      );
      return undefined;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(
      `[api-service] ${normalizedPath} failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
    return undefined;
  }
}
