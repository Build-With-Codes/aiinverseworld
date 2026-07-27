"use client";

import { useState } from "react";

import { recordPromptEvent } from "@/lib/prompts-api";

type PromptCopyButtonProps = {
  slug: string;
  prompt: string;
  className?: string;
};

export function PromptCopyButton({
  slug,
  prompt,
  className = "inline-flex items-center justify-center rounded-sm bg-gradient-to-r from-brand-electric to-brand-violet px-4 py-2 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110",
}: PromptCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard?.writeText(prompt);
    recordPromptEvent(slug, "copy");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button type="button" className={className} onClick={() => void copy()}>
      {copied ? "Copied" : "Copy Prompt"}
    </button>
  );
}
