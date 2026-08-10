import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  /**
   * Heading level to render. Defaults to "h2" since this component is most
   * often used for a section within a page that already has its own h1.
   * Pass "h1" when this is the page's primary heading — every indexable
   * page should have exactly one h1.
   */
  level?: "h1" | "h2";
};

export function SectionHeading({ eyebrow, title, description, action, level = "h2" }: SectionHeadingProps) {
  const Heading = level;
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl space-y-3">
        <span className="text-eyebrow text-brand-cyan-strong">{eyebrow}</span>
        <Heading className="text-display-2 text-text-primary">{title}</Heading>
        {description ? <p className="text-body-lg text-text-secondary">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
