import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";

type EmptyStateAction =
  | { label: string; href: string; onClick?: never }
  | { label: string; onClick: () => void; href?: never };

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
};

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Designed empty state — replaces bare "No results found." text throughout
 * the site. Always pairs the explanation with a concrete next step so a
 * dead end never reads as a dead end.
 */
export function EmptyState({ icon, title, description, primaryAction, secondaryAction }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center gap-4 py-14 text-center ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-subtle bg-surface-3 text-text-muted">
        {icon ?? <DefaultIcon />}
      </div>
      <div className="max-w-sm space-y-1.5">
        <p className="text-heading-2 text-text-primary">{title}</p>
        <p className="text-body text-text-secondary">{description}</p>
      </div>
      {primaryAction || secondaryAction ? (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {primaryAction ? (
            <Button
              href={primaryAction.href}
              onClick={primaryAction.onClick}
              variant="primary"
              size="sm"
            >
              {primaryAction.label}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button
              href={secondaryAction.href}
              onClick={secondaryAction.onClick}
              variant="secondary"
              size="sm"
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
