"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useSession } from "next-auth/react";

import { AuthDialog } from "@/components/auth-dialog";
import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
import { googleAuthEnabled } from "@/lib/auth-config";
import type { ReviewData, ReviewDistribution } from "@/lib/reviews-api";
import { deleteReview, fetchOwnReview, submitReview, updateReview } from "@/lib/reviews-client";

type ReviewSectionProps = {
  toolId: string;
  toolName: string;
  initialReviews: ReviewData[];
  initialAverage: number;
  initialTotal: number;
  initialDistribution: ReviewDistribution;
  callbackUrl?: string;
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={star <= value}
          className="text-2xl leading-none transition hover:scale-110"
        >
          <span className={star <= value ? "text-amber-300" : "text-text-muted"}>★</span>
        </button>
      ))}
    </div>
  );
}

function DistributionBars({
  distribution,
  total,
}: {
  distribution: ReviewDistribution;
  total: number;
}) {
  return (
    <div className="space-y-1.5">
      {([5, 4, 3, 2, 1] as const).map((star) => {
        const count = distribution[String(star) as keyof ReviewDistribution] ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-3 text-right">{star}</span>
            <span aria-hidden className="text-amber-300">
              ★
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
              <div className="h-full rounded-full bg-amber-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-8 text-right [font-variant-numeric:tabular-nums]">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ReviewSection({
  toolId,
  toolName,
  initialReviews,
  initialAverage,
  initialTotal,
  initialDistribution,
  callbackUrl = "/",
}: ReviewSectionProps) {
  const { status } = useSession();
  const signedIn = status === "authenticated";

  const [reviews, setReviews] = useState(initialReviews);
  const [average, setAverage] = useState(initialAverage);
  const [total, setTotal] = useState(initialTotal);
  const [distribution, setDistribution] = useState(initialDistribution);

  const [ownReview, setOwnReview] = useState<ReviewData | null>(null);
  const [ownLoaded, setOwnLoaded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    if (!signedIn) return;
    fetchOwnReview(toolId).then((review) => {
      if (cancelled) return;
      setOwnReview(review);
      if (review) {
        setRating(review.rating);
        setComment(review.comment);
      }
      setOwnLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [signedIn, toolId]);

  function patchListsAfterWrite(prevOwn: ReviewData | null, nextOwn: ReviewData | null) {
    setReviews((prev) => {
      const withoutOwn = prev.filter((r) => r.id !== prevOwn?.id && r.id !== nextOwn?.id);
      return nextOwn ? [nextOwn, ...withoutOwn] : withoutOwn;
    });
    setDistribution((prev) => {
      const next = { ...prev };
      if (prevOwn) {
        const key = String(prevOwn.rating) as keyof ReviewDistribution;
        next[key] = Math.max(0, (next[key] ?? 0) - 1);
      }
      if (nextOwn) {
        const key = String(nextOwn.rating) as keyof ReviewDistribution;
        next[key] = (next[key] ?? 0) + 1;
      }
      return next;
    });
    setAverage((prevAvg) => {
      const prevSum = prevAvg * total - (prevOwn?.rating ?? 0);
      const nextTotal = total + (nextOwn ? 1 : 0) - (prevOwn ? 1 : 0);
      return nextTotal > 0 ? Number(((prevSum + (nextOwn?.rating ?? 0)) / nextTotal).toFixed(2)) : 0;
    });
    setTotal((prev) => prev + (nextOwn ? 1 : 0) - (prevOwn ? 1 : 0));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    startTransition(async () => {
      const result = ownReview
        ? await updateReview(ownReview.id, rating, comment)
        : await submitReview(toolId, rating, comment);

      if (!result.ok || !result.review) {
        setError(result.error || "Something went wrong. Please try again.");
        return;
      }

      patchListsAfterWrite(ownReview, result.review);
      setOwnReview(result.review);
      setEditing(false);
    });
  }

  function handleDelete() {
    if (!ownReview) return;
    startTransition(async () => {
      const ok = await deleteReview(ownReview.id);
      if (!ok) {
        setError("Could not delete your review. Please try again.");
        return;
      }
      patchListsAfterWrite(ownReview, null);
      setOwnReview(null);
      setRating(5);
      setComment("");
      setEditing(false);
    });
  }

  const visibleOwnReview = signedIn ? ownReview : null;
  const visibleOwnLoaded = signedIn ? ownLoaded : true;
  const others = reviews.filter((review) => review.id !== visibleOwnReview?.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className={cardClass({ padding: "lg" })}>
        <div className="flex items-baseline gap-3">
          <span className="text-display-2 text-text-primary [font-variant-numeric:tabular-nums]">
            {average.toFixed(1)}
          </span>
          <span className="text-caption text-text-muted">
            {total} review{total !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="mt-4">
          <DistributionBars distribution={distribution} total={total} />
        </div>

        <div className="mt-6 border-t border-border-subtle pt-6">
          {!signedIn ? (
            <div className="space-y-3">
              <p className="text-body text-text-secondary">
                Sign in to rate {toolName} and leave a review.
              </p>
              <AuthDialog
                callbackUrl={callbackUrl}
                enabled={googleAuthEnabled}
                triggerClassName="inline-flex min-h-11 cursor-pointer items-center rounded-button bg-brand-electric px-5 py-2.5 text-sm font-semibold text-white shadow-card transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-brand-electric-strong hover:shadow-card-hover"
                triggerLabel="Sign in to review"
                title={`Review ${toolName}`}
                description="Use your account to post a verified review you can edit or remove anytime."
              />
            </div>
          ) : !visibleOwnLoaded ? (
            <p className="text-caption text-text-muted">Loading your review…</p>
          ) : visibleOwnReview && !editing ? (
            <div className="space-y-3">
              <p className="text-body font-semibold text-text-primary">Your review</p>
              <div className="flex items-center gap-1 text-amber-300" aria-hidden>
                {"★".repeat(visibleOwnReview.rating)}
                <span className="text-text-muted">{"★".repeat(5 - visibleOwnReview.rating)}</span>
              </div>
              <p className="text-body text-text-secondary">{visibleOwnReview.comment}</p>
              <div className="flex gap-3">
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDelete} disabled={pending}>
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-caption mb-2 text-text-muted">Your rating</p>
                <StarPicker value={rating} onChange={setRating} />
              </div>
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                minLength={10}
                required
                placeholder={`Share how ${toolName} fit your workflow (min. 10 characters)…`}
                className="w-full rounded-input border border-border-subtle bg-surface-2 px-4 py-3 text-sm text-text-primary outline-none transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] placeholder:text-text-muted focus:border-brand-electric focus:ring-2 focus:ring-brand-cyan-strong/30"
              />
              {error ? (
                <p role="alert" className="text-sm text-rose-300">
                  {error}
                </p>
              ) : null}
              <div className="flex gap-3">
                <Button type="submit" variant="primary" size="sm" disabled={pending}>
                  {pending ? "Saving…" : ownReview ? "Save changes" : "Post review"}
                </Button>
                {editing ? (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {others.length === 0 ? (
          <div className={cardClass({ padding: "lg" })}>
            <p className="text-body text-text-secondary">
              No other reviews yet — be the first to share how this tool performs in practice.
            </p>
          </div>
        ) : (
          others.map((review) => (
            <div key={review.id} className={cardClass()}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-text-primary">{review.author}</p>
                <span className="flex items-center gap-1 text-sm text-amber-300">
                  ★ {review.rating}
                </span>
              </div>
              <p className="text-body mt-3 text-text-secondary">{review.comment}</p>
              <p className="text-caption mt-3 text-text-muted">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
