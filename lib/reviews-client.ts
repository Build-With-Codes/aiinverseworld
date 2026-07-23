"use client";

import type { ReviewData, ReviewListResult } from "@/lib/reviews-api";

async function jsonOrNull<T>(promise: Promise<Response>): Promise<T | null> {
  try {
    const res = await promise;
    const payload = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
    if (!res.ok) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function fetchOwnReview(toolId: string): Promise<ReviewData | null> {
  const payload = await jsonOrNull<{ data: ReviewData | null }>(
    fetch(`/api/me/reviews?toolId=${encodeURIComponent(toolId)}`, { cache: "no-store" }),
  );
  return payload?.data ?? null;
}

export async function submitReview(
  toolId: string,
  rating: number,
  comment: string,
): Promise<{ ok: boolean; error?: string; review?: ReviewData }> {
  const res = await fetch("/api/me/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolId, rating, comment }),
  });
  const payload = (await res.json().catch(() => ({}))) as { data?: ReviewData; error?: string };
  if (!res.ok) return { ok: false, error: payload.error || "Could not save your review." };
  return { ok: true, review: payload.data };
}

export async function updateReview(
  id: string,
  rating: number,
  comment: string,
): Promise<{ ok: boolean; error?: string; review?: ReviewData }> {
  const res = await fetch(`/api/me/reviews/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, comment }),
  });
  const payload = (await res.json().catch(() => ({}))) as { data?: ReviewData; error?: string };
  if (!res.ok) return { ok: false, error: payload.error || "Could not update your review." };
  return { ok: true, review: payload.data };
}

export async function deleteReview(id: string): Promise<boolean> {
  const res = await fetch(`/api/me/reviews/${encodeURIComponent(id)}`, { method: "DELETE" });
  return res.ok;
}

export function emptyReviewList(): ReviewListResult {
  return {
    data: [],
    average: 0,
    total: 0,
    distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
}
