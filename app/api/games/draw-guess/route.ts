import type { DrawGuessRoundResponse } from "@/types/draw-guess";
import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    category?: string;
    difficulty?: string;
  };

  try {
    const response = await fetch(`${AIVERSE_WORLD_BASE_URL}/api/games/draw-guess`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = (await response.json()) as { data?: DrawGuessRoundResponse };
    return Response.json(response.ok ? payload.data : payload, {
      status: response.status,
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Could not start the draw guess round.",
        backend: AIVERSE_WORLD_BASE_URL,
      },
      { status: 502 },
    );
  }
}
