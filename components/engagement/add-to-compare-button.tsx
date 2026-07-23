"use client";

import { useCompareTray, type CompareEntry } from "@/components/engagement/compare-tray";

type AddToCompareButtonProps = {
  entry: CompareEntry;
  variant?: "icon" | "full";
};

export function AddToCompareButton({ entry, variant = "full" }: AddToCompareButtonProps) {
  const { has, toggle, items, max } = useCompareTray();
  const inTray = has(entry.id);
  const full = !inTray && items.length >= max;

  return (
    <button
      type="button"
      onClick={() => toggle(entry)}
      disabled={full}
      aria-pressed={inTray}
      title={
        full
          ? `Compare tray is full (max ${max})`
          : inTray
            ? "Remove from compare"
            : "Add to compare"
      }
      className={
        variant === "full"
          ? `inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-semibold transition disabled:opacity-40 ${
              inTray
                ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong"
                : "border-border-strong bg-surface-3 text-text-primary hover:border-border-accent"
            }`
          : `inline-flex h-10 w-10 items-center justify-center rounded-full border transition disabled:opacity-40 ${
              inTray
                ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong"
                : "border-border-subtle bg-surface-2 text-text-muted hover:border-border-accent"
            }`
      }
    >
      <span aria-hidden className="text-base">
        {inTray ? "✓" : "⇄"}
      </span>
      {variant === "full" ? <span>{inTray ? "Added" : "Compare"}</span> : null}
    </button>
  );
}
