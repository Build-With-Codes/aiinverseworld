export const dynamic = "force-dynamic";

const BACKEND_API_BASE_URL =
  process.env.TUTOR_API_BASE_URL ??
  process.env.NEWS_API_BASE_URL ??
  "http://localhost:3001";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${BACKEND_API_BASE_URL}/api/english-tutor/turns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  return Response.json(await response.json(), { status: response.status });
}
