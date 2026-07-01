import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

type ApiGetOptions = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function apiGet<T>(path: string, options: ApiGetOptions = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${AIVERSE_WORLD_BASE_URL}${normalizedPath}`;

  const response = await fetch(url, {
    cache: options.cache ?? "no-store",
    next: options.next,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText} ${normalizedPath}`);
  }

  return (await response.json()) as T;
}
