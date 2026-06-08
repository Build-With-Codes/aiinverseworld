import type { DrawGuessRoundResponse } from "@/types/draw-guess";

export const dynamic = "force-dynamic";
const BACKEND_API_BASE_URL =
  process.env.NEWS_API_BASE_URL ?? "http://localhost:3001";

function buildBackendCandidates() {
  const candidates = [BACKEND_API_BASE_URL];

  try {
    const baseUrl = new URL(BACKEND_API_BASE_URL);
    const isLocalHost =
      baseUrl.hostname === "localhost" || baseUrl.hostname === "127.0.0.1";
    const basePort = Number(baseUrl.port || (baseUrl.protocol === "https:" ? 443 : 80));

    if (isLocalHost && basePort === 3001) {
      for (let port = 3002; port <= 3010; port += 1) {
        candidates.push(`${baseUrl.protocol}//${baseUrl.hostname}:${port}`);
      }
    }
  } catch {
    return candidates;
  }

  return candidates;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    category?: string;
    difficulty?: string;
  };

  let lastStatus = 500;

  for (const baseUrl of buildBackendCandidates()) {
    try {
      const response = await fetch(`${baseUrl}/api/games/draw-guess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      });

      if (!response.ok) {
        lastStatus = response.status;
        continue;
      }

      const payload = (await response.json()) as { data?: DrawGuessRoundResponse };
      return Response.json(payload.data);
    } catch {
      continue;
    }
  }

  return Response.json(
    { error: "Could not start the draw guess round." },
    { status: lastStatus },
  );
}
