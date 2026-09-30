import { queryLocalRecommendations } from "@/lib/local-tools-data";
import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

function localFallback(searchParams: URLSearchParams) {
  const q = searchParams.get("q") ?? "";
  const limit = Number(searchParams.get("limit")) || 8;
  const result = queryLocalRecommendations(q, limit);

  return Response.json({
    query: result.query,
    // Never fabricated — an LLM summary can't be reproduced locally, so this
    // stays empty rather than inventing one. The ranked tool list below is
    // real: the same keyword+quality scoring algorithm the backend itself
    // falls back to when it can't produce an embedding match.
    answer: "",
    retrieval: { strategy: "local-keyword" },
    data: result.data,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `${AIVERSE_WORLD_BASE_URL}/api/tools/recommend/rag?${searchParams.toString()}`,
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (response.status >= 500) {
      return localFallback(searchParams);
    }

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "timed out after 8000ms"
        : error instanceof Error
          ? error.message
          : "unknown error";
    console.warn(`[api/tools/recommend/rag] backend request failed for ${AIVERSE_WORLD_BASE_URL}: ${reason}`);
    return localFallback(searchParams);
  } finally {
    clearTimeout(timer);
  }
}
