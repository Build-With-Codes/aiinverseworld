import type { ReactNode } from "react";

type EditorialBlockProps = {
  eyebrow?: string;
  title?: string;
  tone?: "info" | "verdict";
  children: ReactNode;
};

export function EditorialBlock({ eyebrow, title, tone = "info", children }: EditorialBlockProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-card-lg border border-border-subtle bg-surface-2 p-8 ${
        tone === "verdict" ? "shadow-glow-violet" : "shadow-card"
      }`}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-electric to-brand-violet" aria-hidden />
      {eyebrow ? <p className="text-eyebrow text-brand-electric-strong">{eyebrow}</p> : null}
      {title ? <h3 className="text-heading-1 mt-2 text-text-primary">{title}</h3> : null}
      <div className="text-body-lg mt-4 space-y-4 text-text-secondary">{children}</div>
    </div>
  );
}
