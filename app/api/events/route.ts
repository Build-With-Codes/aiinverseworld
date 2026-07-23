import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

/**
 * Public event-ingestion proxy. Attaches the authenticated userId when present,
 * otherwise forwards the client-supplied anonId. Fire-and-forget: always 202.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type?: string;
      toolId?: string;
      anonId?: string;
      query?: string;
      metadata?: Record<string, unknown>;
    };

    if (!body?.type) {
      return Response.json({ error: "type is required." }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    void fetch(`${AIVERSE_WORLD_BASE_URL}/api/tools/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: body.type,
        toolId: body.toolId,
        userId,
        anonId: userId ? undefined : body.anonId,
        query: body.query,
        metadata: body.metadata,
      }),
      cache: "no-store",
      keepalive: true,
    }).catch(() => undefined);

    return Response.json({ data: { accepted: true } }, { status: 202 });
  } catch {
    return Response.json({ data: { accepted: false } }, { status: 202 });
  }
}
