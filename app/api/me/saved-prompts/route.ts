import { getSessionUserId, unauthorized } from "@/lib/me-proxy";
import { AIVERSE_JOBS_BASE_URL, INTERNAL_API_KEY } from "@/lib/service-urls";

export const dynamic = "force-dynamic";

function promptMeFetch(path: string, options: {
  method?: "GET" | "POST" | "DELETE";
  userId: string;
  query?: Record<string, string | undefined>;
  body?: Record<string, unknown>;
}) {
  const { method = "GET", userId, query = {}, body } = options;
  const url = new URL(`${AIVERSE_JOBS_BASE_URL}/prompts/me/${path}`);
  url.searchParams.set("userId", userId);
  for (const [key, value] of Object.entries(query)) {
    if (value) url.searchParams.set(key, value);
  }

  return fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-internal-api-key": INTERNAL_API_KEY,
    },
    body: body ? JSON.stringify({ ...body, userId }) : undefined,
    cache: "no-store",
  });
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return Response.json({ data: [] });

  const res = await promptMeFetch("saved", { userId });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const body = (await request.json()) as { promptId?: string };
  if (!body?.promptId) {
    return Response.json({ error: "promptId is required." }, { status: 400 });
  }

  const res = await promptMeFetch("saved", {
    method: "POST",
    userId,
    body: { promptId: body.promptId },
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const promptId = new URL(request.url).searchParams.get("promptId") ?? undefined;
  if (!promptId) {
    return Response.json({ error: "promptId is required." }, { status: 400 });
  }

  const res = await promptMeFetch("saved", {
    method: "DELETE",
    userId,
    query: { promptId },
  });
  return new Response(await res.text(), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
