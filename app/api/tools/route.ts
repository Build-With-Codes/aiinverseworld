import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const response = await fetch(
      `${AIVERSE_WORLD_BASE_URL}/api/tools?${searchParams.toString()}`,
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
  } catch (error) {
    console.warn(
      `[api/tools] backend request failed for ${AIVERSE_WORLD_BASE_URL}: ${
        error instanceof Error ? error.message : "unknown error"
      }`,
    );
    return Response.json({
      data: [],
      pagination: { page: 1, limit: 24, total: 0, totalPages: 1 },
      filters: { categories: [] },
    });
  }
}
