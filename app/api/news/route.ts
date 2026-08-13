import { getNewsData } from "@/lib/news/refresh";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") ?? 100);
  const category = searchParams.get("category")?.trim().toLowerCase();

  try {
    const data = await getNewsData();
    const articles = category
      ? data.articles.filter((article) => article.category.toLowerCase() === category)
      : data.articles;

    return Response.json(
      {
        data: articles.slice(0, Number.isFinite(limit) ? limit : 100),
        updatedAt: data.updatedAt,
        isStale: data.isStale,
        isRefreshing: data.isRefreshing,
        message: data.message,
        legal: {
          summaryOnly: true,
          attributionRequired: true,
          note: "News cards show summaries and link to original publishers.",
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("[news] Failed to load news API", error);
    return Response.json({
      data: [],
      legal: {
        summaryOnly: true,
        attributionRequired: true,
        note: "News is unavailable right now.",
      },
    });
  }
}
