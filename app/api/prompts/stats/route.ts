import { AIVERSE_JOBS_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(`${AIVERSE_JOBS_BASE_URL}/prompts/stats`, {
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
      { total: 0, categories: [], models: [], suggestions: [], copies: 0, saves: 0, views: 0 },
      { status: 503 },
    );
  }
}
