import { backendAdminFetch, getAdminKeyFromCookies, unauthorized } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return unauthorized();

  const body = await request.json().catch(() => null);
  const res = await backendAdminFetch("media/upload", { method: "POST", adminKey, body });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
