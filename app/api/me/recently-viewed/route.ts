import { backendMeFetch, getSessionUserId } from "@/lib/me-proxy";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ data: [] });

  const limit = new URL(request.url).searchParams.get("limit") ?? undefined;
  const res = await backendMeFetch("recently-viewed", {
    userId,
    query: { limit },
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
