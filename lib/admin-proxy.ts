import { cookies } from "next/headers";

import { ADMIN_COOKIE_NAME } from "@/lib/admin-constants";
import { ADMIN_API_KEY, AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export { ADMIN_COOKIE_NAME };

/** Matches the backend's `assertAdmin` dev-permissive behavior exactly. */
export function isValidAdminPassword(password: string): boolean {
  if (!ADMIN_API_KEY) {
    return process.env.NODE_ENV !== "production" && password.length > 0;
  }
  return password === ADMIN_API_KEY;
}

export async function getAdminKeyFromCookies(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE_NAME)?.value;
  return value && value.length > 0 ? value : null;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized." }, { status: 401 });
}

type BackendAdminFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  adminKey: string;
  query?: Record<string, string | undefined>;
  body?: unknown;
};

/**
 * Proxy a call to an arbitrary admin-gated backend path (full path, e.g.
 * `api/tools/stats/recompute`), injecting the admin key held in the caller's
 * own httpOnly session cookie.
 */
export async function backendAdminFetchPath(
  fullPath: string,
  { method = "GET", adminKey, query = {}, body }: BackendAdminFetchOptions,
): Promise<Response> {
  const url = new URL(`${AIVERSE_WORLD_BASE_URL}/${fullPath}`);
  for (const [key, value] of Object.entries(query)) {
    if (value != null && value !== "") url.searchParams.set(key, value);
  }

  return fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-admin-api-key": adminKey,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
}

/**
 * Proxy an admin call to the backend's `/api/admin/*` surface, injecting the
 * admin key held in the caller's own httpOnly session cookie. Callers must
 * have already confirmed the cookie is present (via `getAdminKeyFromCookies`).
 */
export function backendAdminFetch(path: string, options: BackendAdminFetchOptions): Promise<Response> {
  return backendAdminFetchPath(`api/admin/${path}`, options);
}
