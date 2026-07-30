import type { ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  invalid?: boolean;
};

export function Input({ className = "", invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || props["aria-invalid"] ? true : undefined}
      className={`platform-input disabled:cursor-not-allowed disabled:opacity-55 aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/20 ${className}`}
      {...props}
    />
  );
}
