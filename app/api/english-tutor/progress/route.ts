import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const backendUrl = new URL(`${AIVERSE_WORLD_BASE_URL}/api/english-tutor/progress`);

  if (userId) {
    backendUrl.searchParams.set("userId", userId);
  }

  try {
    const response = await fetch(backendUrl, { cache: "no-store" });
    return Response.json(await response.json(), { status: response.status });
  } catch {
    return Response.json({
      userId,
      sessions: 0,
      turns: 0,
      averageScore: 0,
      recentSessions: [],
    });
  }
}
