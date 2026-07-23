import { backendAdminFetch, getAdminKeyFromCookies, unauthorized } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return unauthorized();

  const { slug } = await params;
  const res = await backendAdminFetch(`blog/${encodeURIComponent(slug)}`, { adminKey });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return unauthorized();

  const { slug } = await params;
  const res = await backendAdminFetch(`blog/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    adminKey,
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
