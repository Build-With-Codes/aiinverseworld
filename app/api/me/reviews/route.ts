import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { backendMeFetch, getSessionUserId, unauthorized } from "@/lib/me-proxy";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ data: null });

  const toolId = new URL(request.url).searchParams.get("toolId") ?? undefined;
  if (!toolId) return Response.json({ error: "toolId is required." }, { status: 400 });

  const res = await backendMeFetch("reviews", { userId, query: { toolId } });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId || !session?.user?.email) return unauthorized();

  const body = (await request.json()) as { toolId?: string; rating?: number; comment?: string };
  if (!body?.toolId) {
    return Response.json({ error: "toolId is required." }, { status: 400 });
  }

  // Identity comes from the verified session — never trust client-supplied
  // name/email/image for a review author.
  const res = await backendMeFetch("reviews", {
    method: "POST",
    userId,
    body: {
      toolId: body.toolId,
      rating: body.rating,
      comment: body.comment,
      authorName: session.user.name || session.user.email.split("@")[0],
      authorEmail: session.user.email,
      authorImage: session.user.image || undefined,
    },
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
