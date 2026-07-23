import { NextRequest, NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME } from "@/lib/admin-constants";

const legacyRedirects: Record<string, string> = {
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/cookies": "/cookie-policy",
  "/privacy-policy": "/privacy",
  "/terms-and-conditions": "/terms",
  "/terms-of-service": "/terms",
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const redirectTarget = legacyRedirects[normalizedPath];
  const pluralToolMatch = normalizedPath.match(/^\/tools\/(.+)$/);

  if (redirectTarget) {
    return NextResponse.redirect(new URL(redirectTarget, request.url), 308);
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasAdminKey = Boolean(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
    if (!hasAdminKey) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pluralToolMatch) {
    return NextResponse.redirect(new URL(`/tool/${pluralToolMatch[1]}`, request.url), 308);
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return NextResponse.redirect(new URL(normalizedPath, request.url), 308);
  }

  const nonce = btoa(crypto.randomUUID());
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  if (pathname.startsWith("/admin")) {
    requestHeaders.set("x-route-section", "admin");
  }

  const isDev = process.env.NODE_ENV !== "production";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: http:${isDev ? " 'unsafe-eval' 'unsafe-inline'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    [
      "connect-src 'self'",
      "https:",
      "wss:",
      isDev ? "http://localhost:* ws://localhost:*" : "",
    ].filter(Boolean).join(" "),
    "media-src 'self' data: blob: https:",
    "frame-src 'self' https:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ads.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|wasm|js)$).*)",
    },
  ],
};
