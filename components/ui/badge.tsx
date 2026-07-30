import type { ReactNode } from "react";

type BadgeVariant = "brand" | "success" | "warning" | "neutral" | "danger";

const variantClasses: Record<BadgeVariant, string> = {
  brand: "border-brand-electric/25 bg-brand-electric/10 text-brand-electric-strong",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  neutral: "border-border-subtle bg-surface-2 text-text-muted",
  danger: "border-error/25 bg-error/10 text-error",
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
