import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ toolSlug: string }> }) {
  const { toolSlug } = await params;
  const { searchParams } = new URL(request.url);

  try {
    const response = await fetch(
      `${AIVERSE_WORLD_BASE_URL}/api/youtube/${encodeURIComponent(toolSlug)}?${searchParams.toString()}`,
      { cache: "no-store" },
    );

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
          unavailable: true,
          message: "YouTube videos are unavailable right now.",
        },
      },
      { status: 503 },
    );
  }
}
