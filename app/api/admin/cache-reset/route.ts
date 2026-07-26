import { backendAdminFetchPath, getAdminKeyFromCookies, unauthorized } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function POST() {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return unauthorized();

  const res = await backendAdminFetchPath("api/admin/cache/reset", {
    method: "POST",
    adminKey,
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
