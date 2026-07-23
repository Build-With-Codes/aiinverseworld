"use client";

import type { AITool, UserDashboard } from "@/lib/catalog-types";

const ANON_ID_KEY = "aiverse-anon-id";

/** Stable anonymous id (localStorage) used only for event attribution/dedup. */
export function getAnonId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      window.localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export type EngagementEventType =
  | "view"
  | "save"
  | "unsave"
  | "compare"
  | "search"
  | "click";

/** Fire-and-forget event recording. Never throws. */
export function recordEvent(input: {
  type: EngagementEventType;
  toolId?: string;
  query?: string;
  metadata?: Record<string, unknown>;
}): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ ...input, anonId: getAnonId() });
    // Prefer sendBeacon so the request survives navigation.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/events",
        new Blob([body], { type: "application/json" }),
      );
    } else {
      void fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // swallow — tracking must never break the page
  }
}

async function jsonOrNull<T>(promise: Promise<Response>): Promise<T | null> {
  try {
    const res = await promise;
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ── Per-user (proxied through Next.js route handlers) ────────────────────

export async function fetchSaved(): Promise<AITool[]> {
  const payload = await jsonOrNull<{ data?: AITool[] }>(
    fetch("/api/me/saved", { cache: "no-store" }),
  );
  return payload?.data ?? [];
}

export async function saveTool(toolId: string): Promise<boolean> {
  const payload = await jsonOrNull<{ data?: { saved: boolean } }>(
    fetch("/api/me/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolId }),
    }),
  );
  return payload?.data?.saved ?? false;
}

export async function unsaveTool(toolId: string): Promise<boolean> {
  const payload = await jsonOrNull<{ data?: { saved: boolean } }>(
    fetch(`/api/me/saved?toolId=${encodeURIComponent(toolId)}`, {
      method: "DELETE",
    }),
  );
  return payload?.data?.saved ?? false;
}

export async function fetchFollows(): Promise<string[]> {
  const payload = await jsonOrNull<{ data?: string[] }>(
    fetch("/api/me/follows", { cache: "no-store" }),
  );
  return payload?.data ?? [];
}

export async function followCategory(category: string): Promise<boolean> {
  const payload = await jsonOrNull<{ data?: { following: boolean } }>(
    fetch("/api/me/follows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    }),
  );
  return payload?.data?.following ?? false;
}

export async function unfollowCategory(category: string): Promise<boolean> {
  const payload = await jsonOrNull<{ data?: { following: boolean } }>(
    fetch(`/api/me/follows?category=${encodeURIComponent(category)}`, {
      method: "DELETE",
    }),
  );
  return payload?.data?.following ?? false;
}

export async function fetchDashboard(): Promise<UserDashboard | null> {
  const payload = await jsonOrNull<{ data?: UserDashboard }>(
    fetch("/api/me/dashboard", { cache: "no-store" }),
  );
  return payload?.data ?? null;
}
