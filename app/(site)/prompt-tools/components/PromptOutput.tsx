"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type PromptOutputProps = {
  eyebrow: string;
  title: string;
  content: string;
  /** Wraps {{variable}} occurrences in a highlighted chip instead of plain text — Template Builder only. */
  highlightVariables?: boolean;
  actionLabel: string;
};

const variablePattern = /(\{\{[^{}]+\}\})/g;

function HighlightedContent({ content }: { content: string }) {
  const parts = content.split(variablePattern);
  return (
    <>
      {parts.map((part, index) =>
        variablePattern.test(part) ? (
          <span
            key={index}
            className="rounded-sm border border-brand-cyan-strong/30 bg-brand-cyan/12 px-1 py-0.5 font-semibold text-brand-cyan-strong"
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * The "this is the result I created" surface for builders and utilities —
 * a dedicated output component instead of a bare <pre> dump, with its own
 * copy action so the primary action button and the output stay in sync.
 */
export function PromptOutput({ eyebrow, title, content, highlightVariables, actionLabel }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="flex min-h-[26rem] flex-col rounded-card-lg bg-surface-2 p-5 shadow-card sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow text-brand-electric-strong">{eyebrow}</p>
          <h2 className="text-heading-1 mt-2 text-text-primary">{title}</h2>
        </div>
        <Button type="button" onClick={() => void copy()} size="sm" variant={copied ? "secondary" : "primary"}>
          {copied ? "Copied ✓" : actionLabel}
        </Button>
      </div>
      <pre className="flex-1 overflow-auto whitespace-pre-wrap rounded-card bg-surface-1 p-5 font-mono text-sm leading-7 text-text-secondary">
        {highlightVariables ? <HighlightedContent content={content} /> : content}
      </pre>
    </div>
  );
}
