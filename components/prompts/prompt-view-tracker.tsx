"use client";

import { useEffect } from "react";

import { recordPromptEvent } from "@/lib/prompts-api";

export function PromptViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    recordPromptEvent(slug, "view");
  }, [slug]);

  return null;
}
