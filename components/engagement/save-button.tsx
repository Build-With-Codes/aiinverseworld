"use client";

import type { MouseEvent } from "react";

import { AuthDialog } from "@/components/auth-dialog";
import { useSavedTools } from "@/components/engagement/saved-tools";
import { googleAuthEnabled } from "@/lib/auth-config";

type SaveButtonProps = {
  toolId: string;
  toolName: string;
  variant?: "icon" | "full";
  callbackUrl?: string;
};

function buttonClass(variant: "icon" | "full", saved: boolean) {
  if (variant === "full") {
    return `inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-semibold transition ${
      saved
        ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong"
        : "border-border-strong bg-surface-3 text-text-primary hover:border-border-accent"
    }`;
  }
  return `inline-flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-xl transition ${
    saved
      ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong"
      : "border-border-subtle bg-surface-2/90 text-text-muted hover:border-border-accent hover:text-brand-cyan-strong"
  }`;
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[18px] w-[18px] transition-transform duration-200 ${filled ? "scale-105" : ""}`}
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

/** Cards that wrap a whole tool in a <Link> need this button to never trigger the card's own navigation. */
function stopBubble(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function SaveButton({
  toolId,
  toolName,
  variant = "icon",
  callbackUrl = "/",
}: SaveButtonProps) {
  const { has, toggle, signedIn } = useSavedTools();
  const saved = has(toolId);

  // Signed out → the AuthDialog's own trigger becomes the save button.
  if (!signedIn) {
    return (
      <span onClick={stopBubble} className="inline-flex">
        <AuthDialog
          callbackUrl={callbackUrl}
          enabled={googleAuthEnabled}
          triggerClassName={buttonClass(variant, false)}
          triggerAriaLabel={`Sign in to save ${toolName}`}
          triggerLabel={
            <>
              <BookmarkIcon filled={false} />
              {variant === "full" ? <span>Save</span> : null}
            </>
          }
          title={`Save ${toolName}`}
          description="Sign in to save tools to your library, sync across devices, and get personalized recommendations."
        />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        stopBubble(event);
        void toggle(toolId);
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${toolName} from saved` : `Save ${toolName}`}
      title={saved ? "Remove from saved" : "Save for later"}
      className={buttonClass(variant, saved)}
    >
      <BookmarkIcon filled={saved} />
      {variant === "full" ? <span>{saved ? "Saved" : "Save"}</span> : null}
    </button>
  );
}
