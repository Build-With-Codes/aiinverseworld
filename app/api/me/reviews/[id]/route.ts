import { backendMeFetch, getSessionUserId, unauthorized } from "@/lib/me-proxy";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;
  const body = (await request.json()) as { rating?: number; comment?: string };

  const res = await backendMeFetch(`reviews/${encodeURIComponent(id)}`, {
    method: "PUT",
    userId,
    body: { rating: body.rating, comment: body.comment },
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;
  const res = await backendMeFetch(`reviews/${encodeURIComponent(id)}`, {
    method: "DELETE",
    userId,
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
