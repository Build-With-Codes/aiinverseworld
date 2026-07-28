"use client";

import type { MouseEvent, ReactNode } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { useSavedPrompts } from "@/components/engagement/saved-prompts";
import { googleAuthEnabled } from "@/lib/auth-config";

type SavePromptButtonProps = {
  promptId: string;
  promptTitle: string;
  callbackUrl?: string;
  className?: string;
  children?: ReactNode;
};

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[17px] w-[17px] transition-transform duration-200 ${filled ? "scale-105" : ""}`}
      fill={filled ? "currentColor" : "none"}
      aria-hidden
    >
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function stopBubble(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function SavePromptButton({
  promptId,
  promptTitle,
  callbackUrl = "/prompts",
  className = "inline-flex items-center justify-center gap-2 rounded-sm border border-border-subtle bg-surface-2 px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-border-accent hover:text-text-primary",
  children,
}: SavePromptButtonProps) {
  const { has, toggle, signedIn } = useSavedPrompts();
  const saved = has(promptId);
  const label = saved ? "Saved" : "Save";

  if (!signedIn) {
    return (
      <span onClick={stopBubble} className="inline-flex">
        <AuthDialog
          callbackUrl={callbackUrl}
          enabled={googleAuthEnabled}
          triggerClassName={className}
          triggerAriaLabel={`Sign in to save ${promptTitle}`}
          triggerLabel={children ?? (
            <>
              <BookmarkIcon filled={false} />
              <span>Save</span>
            </>
          )}
          title={`Save ${promptTitle}`}
          description="Sign in to save prompts to your library and sync them across devices."
        />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        stopBubble(event);
        void toggle(promptId);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${promptTitle} from saved` : `Save ${promptTitle}`}
      title={saved ? "Remove from saved" : "Save prompt"}
      className={`${className} ${saved ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong" : ""}`}
    >
      <BookmarkIcon filled={saved} />
      <span>{children ?? label}</span>
    </button>
  );
}
