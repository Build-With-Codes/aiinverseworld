import type { ReactNode } from "react";

type BuilderSectionProps = {
  label: string;
  children: ReactNode;
};

/**
 * Labeled grouping for a builder's input fields (Role / Instructions /
 * Boundaries, Subject / Style, Topic / Audience / Variables, ...) — turns a
 * flat stack of inputs into a structured composition experience without
 * inventing fields the tool doesn't actually have.
 */
export function BuilderSection({ label, children }: BuilderSectionProps) {
  return (
    <div className="border-l-2 border-border-subtle pl-4">
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</p>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}
