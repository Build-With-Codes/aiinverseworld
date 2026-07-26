import { AIVERSE_JOBS_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const response = await fetch(
      `${AIVERSE_JOBS_BASE_URL}/jobs/search?${searchParams.toString()}`,
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
    return Response.json(
      {
        data: [],
        meta: {
          total: 0,
          unavailable: true,
          message: "Jobs are unavailable right now.",
        },
      },
      { status: 503 },
    );
  }
}
