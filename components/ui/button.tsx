import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-brand-electric to-brand-violet text-white shadow-glow-cyan hover:brightness-110",
  secondary:
    "border border-border-strong bg-surface-3 text-text-primary hover:border-border-accent",
  outline: "border border-border-accent text-text-primary hover:bg-surface-2",
  ghost: "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-pill font-semibold transition duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    const isExternal = /^https?:\/\//.test(href);

    return (
      <Link
        href={href}
        className={classes}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
