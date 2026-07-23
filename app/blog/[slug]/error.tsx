"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/ui/error-state";

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[blog] article page error:", error);
  }, [error]);

  return (
    <ErrorState
      title="This article couldn't load"
      description="We couldn't reach this post just now. Try again, or head back to the blog."
      onRetry={reset}
      homeHref="/blog"
    />
  );
}
