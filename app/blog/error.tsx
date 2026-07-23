"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/ui/error-state";

export default function BlogError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[blog] list page error:", error);
  }, [error]);

  return (
    <ErrorState
      title="The blog couldn't load"
      description="We couldn't reach the article catalog just now. This is usually a brief backend hiccup."
      onRetry={reset}
      homeHref="/"
    />
  );
}
