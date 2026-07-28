import Link from "next/link";
import type { Metadata } from "next";


import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { backendAdminFetch, getAdminKeyFromCookies } from "@/lib/admin-proxy";
import { cardClass } from "@/components/ui/card";

import { ReviewRowActions } from "./review-row-actions";

export const metadata: Metadata = buildNoIndexMetadata("Admin reviews | AiverseWorld");

export const dynamic = "force-dynamic";

type AdminReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
  tool: { name: string; slug: string | null };
};

async function getReviews(): Promise<AdminReview[]> {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return [];

  const res = await backendAdminFetch("reviews", { adminKey, query: { limit: "50" } });
  if (!res.ok) return [];
  const payload = (await res.json()) as { data?: AdminReview[] };
  return payload.data ?? [];
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-1 text-text-primary">Reviews</h1>
        <p className="text-body mt-1 text-text-secondary">
          {reviews.length} most recent — remove anything abusive, spam, or off-topic.
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className={cardClass({ padding: "lg", radius: "card-lg" })}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-text-primary">{review.author}</span>
                  <span className="text-text-muted">on</span>
                  {review.tool.slug ? (
                    <Link
                      href={`/tool/${review.tool.slug}`}
                      target="_blank"
                      className="font-semibold text-brand-cyan-strong hover:text-brand-cyan"
                    >
                      {review.tool.name}
                    </Link>
                  ) : (
                    <span className="text-text-secondary">{review.tool.name}</span>
                  )}
                  <span aria-hidden className="text-amber-400">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-body text-text-secondary">{review.comment}</p>
                <p className="text-caption text-text-muted">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
              <ReviewRowActions id={review.id} />
            </div>
          </div>
        ))}
        {reviews.length === 0 ? (
          <div className={`text-center text-text-muted ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
            No reviews yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
