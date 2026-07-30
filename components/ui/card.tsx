import type { ComponentPropsWithoutRef } from "react";

export type CardOptions = {
  hover?: boolean;
  glow?: "cyan" | "violet" | "none";
  padding?: "none" | "sm" | "md" | "lg";
  radius?: "card" | "card-lg";
};

const paddingClasses: Record<NonNullable<CardOptions["padding"]>, string> = {
  none: "",
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

export function cardClass({
  hover = false,
  glow = "none",
  padding = "md",
  radius = "card",
}: CardOptions = {}) {
  const glowClass =
    glow === "cyan" ? "shadow-glow-cyan" : glow === "violet" ? "shadow-glow-violet" : "";
  const radiusClass = radius === "card-lg" ? "rounded-card-lg" : "rounded-card";
  const hoverClass = hover
    ? "transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-3 hover:shadow-card-hover"
    : "";

  return [radiusClass, "border border-border-subtle bg-surface-2", glowClass, paddingClasses[padding], hoverClass]
    .filter(Boolean)
    .join(" ");
}

type CardProps = ComponentPropsWithoutRef<"div"> & CardOptions;

export function Card({ hover, glow, padding, radius, className = "", children, ...props }: CardProps) {
  return (
    <div className={`${cardClass({ hover, glow, padding, radius })} ${className}`} {...props}>
      {children}
    </div>
  );
}
