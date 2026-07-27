"use client";

import { useState } from "react";

import { recordPromptEvent } from "@/lib/prompts-api";

type PromptShareButtonProps = {
  slug: string;
  title: string;
  description?: string | null;
  className?: string;
  label?: string;
};

export function PromptShareButton({
  slug,
  title,
  description,
  className = "inline-flex items-center justify-center rounded-sm border border-border-subtle bg-surface-2 px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-border-accent hover:text-text-primary",
  label = "Share",
}: PromptShareButtonProps) {
  const [shared, setShared] = useState(false);

  async function sharePrompt() {
    const url = `${window.location.origin}/prompts/${slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description ?? title, url });
      } else {
        await navigator.clipboard?.writeText(url);
      }
      recordPromptEvent(slug, "share");
      setShared(true);
      window.setTimeout(() => setShared(false), 1400);
    } catch {
      // Cancelled native share sheets should not surface as UI errors.
    }
  }

  return (
    <button type="button" className={className} onClick={() => void sharePrompt()}>
      {shared ? "Shared" : label}
    </button>
  );
}
