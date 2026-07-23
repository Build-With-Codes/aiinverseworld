import type { ReactNode } from "react";

type BadgeVariant = "brand" | "success" | "warning" | "neutral" | "danger";

const variantClasses: Record<BadgeVariant, string> = {
  brand: "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong",
  success: "border-emerald-300/20 bg-emerald-300/10 text-emerald-300",
  warning: "border-amber-300/20 bg-amber-300/10 text-amber-300",
  neutral: "border-border-subtle bg-surface-2 text-text-muted",
  danger: "border-rose-300/20 bg-rose-300/10 text-rose-300",
};

type BadgeProps = {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
};

export function Badge({ variant = "neutral", className = "", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
