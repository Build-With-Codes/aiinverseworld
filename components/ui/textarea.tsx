import type { ComponentPropsWithoutRef } from "react";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  invalid?: boolean;
};

export function Textarea({ className = "", invalid, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || props["aria-invalid"] ? true : undefined}
      className={`platform-textarea resize-y disabled:cursor-not-allowed disabled:opacity-55 aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/20 ${className}`}
      {...props}
    />
  );
}
