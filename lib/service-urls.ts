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
