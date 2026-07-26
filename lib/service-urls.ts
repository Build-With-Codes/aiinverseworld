const isProduction = process.env.NODE_ENV === "production";

export const AIVERSE_WORLD_BASE_URL =
  process.env.AIVERSE_WORLD_BASE_URL ??
  process.env.NEXT_PUBLIC_AIVERSE_WORLD_BASE_URL ??
  (isProduction
    ? "https://aiverseworld-backend.onrender.com"
    : "http://localhost:3001");

export const AIVERSE_AUTH_BASE_URL =
  process.env.AIVERSE_AUTH_BASE_URL ??
  process.env.NEXT_PUBLIC_AIVERSE_AUTH_BASE_URL ??
  "http://localhost:3002";

export const AIVERSE_JOBS_BASE_URL =
  process.env.AIVERSE_JOBS_BASE_URL ??
  process.env.NEXT_PUBLIC_AIVERSE_JOBS_BASE_URL ??
  "http://localhost:3002";

// Server-only shared secret for per-user engagement endpoints on the backend.
// Never exposed to the client (no NEXT_PUBLIC_ fallback).
export const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? "";

// Server-only shared secret gating the backend's /api/admin/* endpoints.
// Doubles as the /admin/login password for this single-operator setup.
export const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? "";
