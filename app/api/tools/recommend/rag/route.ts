import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const response = await fetch(
      `${AIVERSE_WORLD_BASE_URL}/api/tools/recommend/rag?${searchParams.toString()}`,
      {
        cache: "no-store",
      },
    );

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return Response.json({
      query: searchParams.get("q") ?? "",
      answer: "No recommendations are available right now.",
      retrieval: { strategy: "unavailable" },
      data: [],
    });
  }
}
