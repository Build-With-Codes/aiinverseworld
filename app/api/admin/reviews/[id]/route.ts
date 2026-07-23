import { backendAdminFetch, getAdminKeyFromCookies, unauthorized } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return unauthorized();

  const { id } = await params;
  const res = await backendAdminFetch(`reviews/${encodeURIComponent(id)}`, {
    method: "DELETE",
    adminKey,
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
