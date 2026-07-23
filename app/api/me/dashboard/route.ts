import { backendMeFetch, getSessionUserId } from "@/lib/me-proxy";

export const dynamic = "force-dynamic";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ data: null });

  const res = await backendMeFetch("dashboard", { userId });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
