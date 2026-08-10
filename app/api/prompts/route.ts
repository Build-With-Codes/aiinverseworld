import { AIVERSE_JOBS_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const response = await fetch(`${AIVERSE_JOBS_BASE_URL}/prompts?${searchParams.toString()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return Response.json(
      {
        data: [],
        meta: {
          page: 1,
          limit: Number(searchParams.get("limit") ?? 12),
          total: 0,
          totalPages: 1,
          message: "Prompt service is unavailable.",
        },
      },
      { status: 503 },
    );
  }
}
