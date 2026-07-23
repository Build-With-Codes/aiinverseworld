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
    glow === "cyan" ? "shadow-glow-cyan" : glow === "violet" ? "shadow-glow-violet" : "shadow-card";
  const radiusClass = radius === "card-lg" ? "rounded-card-lg" : "rounded-card";
  const hoverClass = hover
    ? "transition duration-300 hover:-translate-y-1 hover:border-border-accent hover:shadow-card-hover"
    : "";

  return [radiusClass, "border border-border-subtle bg-surface-2 backdrop-blur-xl", glowClass, paddingClasses[padding], hoverClass]
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
