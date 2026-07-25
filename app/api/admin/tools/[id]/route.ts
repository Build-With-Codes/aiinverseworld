import { backendAdminFetch, getAdminKeyFromCookies, unauthorized } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return unauthorized();

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const res = await backendAdminFetch(`tools/${encodeURIComponent(id)}`, {
    method: "PUT",
    adminKey,
    body,
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
