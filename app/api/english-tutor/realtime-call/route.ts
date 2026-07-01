import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const sdpOffer = await request.text();
  const focus = request.headers.get("x-tutor-focus") ?? "Daily conversation";
  const userId = request.headers.get("x-tutor-user-id") ?? "";

  if (!sdpOffer.trim()) {
    return Response.json({ error: "SDP offer is required." }, { status: 400 });
  }

  try {
    const response = await fetch(`${AIVERSE_WORLD_BASE_URL}/api/english-tutor/realtime-call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/sdp",
        "x-tutor-focus": focus,
        "x-tutor-user-id": userId,
      },
      body: sdpOffer,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        {
          error: errorText || `Backend returned ${response.status}`,
          backend: AIVERSE_WORLD_BASE_URL,
        },
        { status: response.status },
      );
    }

    const payload = (await response.json()) as {
      sdp: string;
      session: { sessionId: string };
    };

    return new Response(payload.sdp, {
      status: 200,
      headers: {
        "Content-Type": "application/sdp",
        "x-tutor-session-id": payload.session.sessionId,
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Backend request failed.",
        backend: AIVERSE_WORLD_BASE_URL,
      },
      { status: 502 },
    );
  }
}
