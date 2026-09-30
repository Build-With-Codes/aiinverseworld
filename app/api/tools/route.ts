import { queryLocalTools } from "@/lib/local-tools-data";
import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

function localFallback(searchParams: URLSearchParams) {
  const toBool = (name: string) => searchParams.get(name) === "true";
  const sort = searchParams.get("sort");

  return Response.json(
    queryLocalTools({
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 24,
      category: searchParams.get("category") ?? undefined,
      pricing: searchParams.get("pricing") ?? undefined,
      platform: searchParams.get("platform") ?? undefined,
      freeOnly: toBool("freeOnly"),
      apiOnly: toBool("apiOnly"),
      openSourceOnly: toBool("openSourceOnly"),
      search: searchParams.get("q") ?? undefined,
      sort: sort === "popular" || sort === "rating" || sort === "newest" ? sort : "rank",
    }),
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const controller = new AbortController();
  // Without a timeout, a backend that hangs instead of refusing the
  // connection outright would block this handler indefinitely, and the
  // fallback below would never get a chance to run.
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `${AIVERSE_WORLD_BASE_URL}/api/tools?${searchParams.toString()}`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    // Backend answered but errored (not a legitimate "no results" 4xx) —
    // treat the same as unreachable so the search page still works.
    if (response.status >= 500) {
      return localFallback(searchParams);
    }

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "timed out after 8000ms"
        : error instanceof Error
          ? error.message
          : "unknown error";
    console.warn(`[api/tools] backend request failed for ${AIVERSE_WORLD_BASE_URL}: ${reason}`);
    return localFallback(searchParams);
  } finally {
    clearTimeout(timer);
  }
}
