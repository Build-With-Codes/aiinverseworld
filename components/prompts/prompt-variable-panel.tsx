"use client";

import { useMemo, useState } from "react";

import { recordPromptEvent } from "@/lib/prompts-api";
import { applyPromptVariables, getInitialPromptVariables } from "@/lib/prompt-variables";

type PromptVariablePanelProps = {
  slug: string;
  promptText: string;
  initialVariables: Record<string, string>;
};

/**
 * Interactive prompt body: editable variable inputs with a live-substituted
 * preview and a copy button that copies the customized text, not the raw
 * `{{placeholder}}` template. This is the same pattern already built for the
 * /prompts list page's "Variable Playground" — this brings it to the
 * individual prompt page, where a user landing after clicking through would
 * expect to actually use it.
 */
export function PromptVariablePanel({ slug, promptText, initialVariables }: PromptVariablePanelProps) {
  const [values, setValues] = useState(initialVariables);
  const [copied, setCopied] = useState(false);
  const hasVariables = Object.keys(initialVariables).length > 0;
  const preview = useMemo(() => applyPromptVariables(promptText, values), [promptText, values]);

  async function copy() {
    await navigator.clipboard?.writeText(preview);
    recordPromptEvent(slug, "copy");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <section className="mt-8 space-y-5">
      {hasVariables ? (
        <div className="rounded-card border border-border-subtle bg-surface-1/70 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-heading-2 text-text-primary">Customize this prompt</h2>
            <span className="rounded-pill border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
              Live preview
            </span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            Fill in the placeholders below — the prompt updates as you type.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(values).map(([key, value]) => (
              <label key={key} className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">{key}</span>
                <input
                  value={value}
                  onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                  className="platform-filter-input mt-1 h-11 w-full rounded-sm px-3 text-sm"
                  placeholder={key}
                />
              </label>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-eyebrow text-brand-electric-strong">
              {hasVariables ? "Ready to use" : "Prompt"}
            </p>
            <h2 className="text-heading-1 mt-1 text-text-primary">Your prompt</h2>
          </div>
          <button
            type="button"
            onClick={() => void copy()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-brand-electric to-brand-violet px-4 py-2 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
          >
            {copied ? "Copied ✓" : "Copy prompt"}
          </button>
        </div>
        <pre className="mt-3 overflow-auto rounded-card-lg border border-border-accent bg-surface-1 p-5 text-sm leading-7 text-text-primary whitespace-pre-wrap shadow-card">
          {preview}
        </pre>
      </div>
    </section>
  );
}
