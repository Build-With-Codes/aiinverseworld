"use client";

import Link from "next/link";

import { SavePromptButton } from "@/components/engagement/save-prompt-button";
import { useSavedPrompts } from "@/components/engagement/saved-prompts";
import { PromptShareButton } from "@/components/prompts/prompt-share-button";
import { Button } from "@/components/ui/button";
import type { AiPrompt } from "@/lib/prompts-api";

function compactNumber(value?: number | null) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0);
}

export function SavedPromptsGrid({ initialPrompts }: { initialPrompts: AiPrompt[] }) {
  const { savedIds, ready } = useSavedPrompts();
  const prompts = ready ? initialPrompts.filter((prompt) => savedIds.has(prompt.id)) : initialPrompts;

  if (prompts.length === 0) {
    return (
      <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-8 text-center">
        <p className="text-heading-3 text-text-primary">No saved prompts yet</p>
        <p className="text-body mt-2 text-text-secondary">Save prompts from the Prompt Library and they will appear here.</p>
        <Button href="/prompts" className="mt-5 rounded-pill">Browse prompts</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {prompts.map((prompt) => (
        <article key={prompt.id} className="rounded-card border border-border-subtle bg-surface-2 p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-brand-cyan-strong">{prompt.promptType}</p>
              <h3 className="mt-2 line-clamp-2 text-lg font-bold text-text-primary">
                <Link href={`/prompts/${prompt.slug}`} className="hover:text-brand-cyan-strong">
                  {prompt.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">{prompt.description}</p>
            </div>
            <SavePromptButton
              promptId={prompt.id}
              promptTitle={prompt.title}
              callbackUrl="/saved"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-border-subtle bg-surface-1 px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-border-accent hover:text-text-primary"
            >
              <span className="sr-only">Save</span>
            </SavePromptButton>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button href={`/prompts/${prompt.slug}`} size="sm" variant="secondary" className="rounded-sm">
              View Details
            </Button>
            <PromptShareButton
              slug={prompt.slug}
              title={prompt.title}
              description={prompt.description}
              className="inline-flex items-center justify-center rounded-sm border border-border-subtle bg-surface-1 px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-border-accent hover:text-text-primary"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-text-muted">
            <span>{compactNumber(prompt.stats?.copies)} copies</span>
            <span>{compactNumber(prompt.stats?.saves)} saves</span>
            <span>Score {prompt.qualityScore}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
