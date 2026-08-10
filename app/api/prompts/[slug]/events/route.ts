import { AIVERSE_JOBS_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const body = (await request.json()) as { type?: string };

  try {
    const response = await fetch(`${AIVERSE_JOBS_BASE_URL}/prompts/${encodeURIComponent(slug)}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: body.type }),
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
    return Response.json({ error: "Prompt service is unavailable." }, { status: 503 });
  }
}
