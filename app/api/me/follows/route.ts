import { backendMeFetch, getSessionUserId, unauthorized } from "@/lib/me-proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ data: [] });

  const res = await backendMeFetch("follows", { userId });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const body = (await request.json()) as { category?: string };
  if (!body?.category) {
    return Response.json({ error: "category is required." }, { status: 400 });
  }

  const res = await backendMeFetch("follows", {
    method: "POST",
    userId,
    body: { category: body.category },
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const category = new URL(request.url).searchParams.get("category") ?? undefined;
  if (!category) {
    return Response.json({ error: "category is required." }, { status: 400 });
  }

  const res = await backendMeFetch("follows", {
    method: "DELETE",
    userId,
    query: { category },
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
