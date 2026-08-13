import { getTrendingProjectsData } from "@/lib/trending/refresh";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  try {
    const data = await getTrendingProjectsData();
    return Response.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[trending-projects] Failed to load trending projects", error);
    return Response.json(
      {
        updatedAt: new Date().toISOString(),
        projects: [],
        isStale: true,
        message: "Trending projects are being prepared. Please check back shortly.",
      },
      { status: 503 },
    );
  }
}
