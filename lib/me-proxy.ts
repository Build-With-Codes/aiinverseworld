import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { AIVERSE_WORLD_BASE_URL, INTERNAL_API_KEY } from "@/lib/service-urls";

export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

/**
 * Proxy a per-user engagement call to the backend, injecting the trusted
 * userId and the internal shared secret. Callers must have already verified
 * the session and passed a real userId.
 */
export async function backendMeFetch(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    userId: string;
    query?: Record<string, string | undefined>;
    body?: Record<string, unknown>;
  },
): Promise<Response> {
  const { method = "GET", userId, query = {}, body } = options;
  const url = new URL(`${AIVERSE_WORLD_BASE_URL}/api/me/${path}`);
  url.searchParams.set("userId", userId);
  for (const [key, value] of Object.entries(query)) {
    if (value != null && value !== "") url.searchParams.set(key, value);
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

export function unauthorized() {
  return Response.json({ error: "Unauthorized." }, { status: 401 });
}
