"use client";

import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  homeHref?: string;
};

/** Shared, on-brand fallback for route error.tsx boundaries. */
export function ErrorState({
  title = "Something went wrong",
  description = "This page hit a snag loading its data. This is usually temporary — try again in a moment.",
  onRetry,
  homeHref = "/",
}: ErrorStateProps) {
  return (
    <div className={`mx-auto my-10 max-w-lg text-center ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
      <span aria-hidden className="text-3xl">
        ⚠️
      </span>
      <h1 className="text-heading-1 mt-4 text-text-primary">{title}</h1>
      <p className="text-body mt-2 text-text-secondary">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button onClick={onRetry} variant="primary">
            Try again
          </Button>
        ) : null}
        <Button href={homeHref} variant="secondary">
          Back to home
        </Button>
      </div>
    </div>
  );
}
