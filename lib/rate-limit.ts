/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Scope/limitation: this state lives in the Node process's memory, so it
 * resets on cold start and isn't shared across serverless instances/regions.
 * It's a real, meaningful deterrent for a single-operator, low-traffic site
 * (raises brute-force cost from "unlimited" to "N attempts per instance per
 * window"), not a distributed-systems-grade limiter — a Redis-backed limiter
 * would be the correct upgrade if this app ever runs multi-instance behind a
 * load balancer at meaningful traffic.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

// Periodic cleanup so this Map can't grow unboundedly over the process lifetime.
const MAX_TRACKED_KEYS = 5000;

export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, retryAfterMs: 0 };
}

/** Best-effort caller identity for rate limiting — not spoof-proof, but raises the bar. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
