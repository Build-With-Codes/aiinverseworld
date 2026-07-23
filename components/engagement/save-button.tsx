"use client";

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
  return `inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
    saved
      ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong"
      : "border-border-subtle bg-surface-2 text-text-muted hover:border-border-accent hover:text-brand-cyan-strong"
  }`;
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
      <AuthDialog
        callbackUrl={callbackUrl}
        enabled={googleAuthEnabled}
        triggerClassName={buttonClass(variant, false)}
        triggerLabel={
          <>
            <span aria-hidden className="text-base">
              ☆
            </span>
            {variant === "full" ? <span>Save</span> : null}
          </>
        }
        title={`Save ${toolName}`}
        description="Sign in to save tools to your library, sync across devices, and get personalized recommendations."
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => void toggle(toolId)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${toolName} from saved` : `Save ${toolName}`}
      title={saved ? "Remove from saved" : "Save for later"}
      className={buttonClass(variant, saved)}
    >
      <span
        aria-hidden
        className={`text-base transition-transform duration-200 ${saved ? "scale-110" : ""}`}
      >
        {saved ? "★" : "☆"}
      </span>
      {variant === "full" ? <span>{saved ? "Saved" : "Save"}</span> : null}
    </button>
  );
}
