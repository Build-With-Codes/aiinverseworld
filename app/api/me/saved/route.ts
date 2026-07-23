import { backendMeFetch, getSessionUserId, unauthorized } from "@/lib/me-proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ data: [] });

  const res = await backendMeFetch("saved", { userId });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const body = (await request.json()) as { toolId?: string };
  if (!body?.toolId) {
    return Response.json({ error: "toolId is required." }, { status: 400 });
  }

  const res = await backendMeFetch("saved", {
    method: "POST",
    userId,
    body: { toolId: body.toolId },
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const toolId = new URL(request.url).searchParams.get("toolId") ?? undefined;
  if (!toolId) {
    return Response.json({ error: "toolId is required." }, { status: 400 });
  }

  const res = await backendMeFetch("saved", {
    method: "DELETE",
    userId,
    query: { toolId },
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
