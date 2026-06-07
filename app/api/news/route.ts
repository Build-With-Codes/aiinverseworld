import { NEWS_API_BASE_URL } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const response = await fetch(
    `${NEWS_API_BASE_URL}/api/news?${searchParams.toString()}`,
    {
      cache: "no-store",
    },
  );

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
