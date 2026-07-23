// Split from lib/admin-proxy.ts so middleware (Edge runtime, no `next/headers`
// support) can reference the cookie name without pulling in that module.
export const ADMIN_COOKIE_NAME = "aiverse_admin_key";
