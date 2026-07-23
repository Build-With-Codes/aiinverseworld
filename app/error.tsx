"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/ui/error-state";

export default function GlobalPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled page error:", error);
  }, [error]);

  return <ErrorState onRetry={reset} />;
}
