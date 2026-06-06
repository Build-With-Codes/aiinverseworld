"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { GoogleSignInButton } from "@/components/google-auth-button";

type AuthDialogProps = {
  callbackUrl: string;
  enabled?: boolean;
  triggerClassName?: string;
  triggerLabel?: string;
  title?: string;
  description?: string;
};

const authBenefits = [
  "Post verified reviews",
  "Save and compare tools",
  "Sync your shortlist across devices",
];

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function AuthDialog({
  callbackUrl,
  enabled = true,
  triggerClassName,
  triggerLabel = "Sign In with Google",
  title = "Join AiverseWorld",
  description = "Sign in with Google to review tools, save favorites, and build a trusted shortlist.",
}: AuthDialogProps) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const dialog =
    open && mounted ? (
      <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4">
        <button
          type="button"
          aria-label="Close sign in dialog"
          onClick={() => setOpen(false)}
          className="auth-dialog__overlay absolute inset-0 backdrop-blur-md"
        />
        <div className="auth-dialog__panel relative z-10 my-3 w-full max-w-xl overflow-y-auto rounded-[34px] border border-white/10 shadow-[0_30px_120px_rgba(2,6,23,0.55)] sm:my-0">
          <div className="auth-dialog__content bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.16),_transparent_30%)] p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-[11px] font-semibold tracking-[0.24em] text-cyan-200 uppercase">
                  Account Access
                </span>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:mt-5 sm:text-3xl">
                  {title}
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">
                  {description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="auth-dialog__close shrink-0 rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {authBenefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm text-slate-200"
                >
                  {benefit}
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/6 p-5 sm:p-6">
              <p className="text-sm font-medium text-white">Continue with Google</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                We use Google sign-in for quick onboarding and verified user identity.
                Your reviews stay in your own platform data flow.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                {enabled ? (
                  <GoogleSignInButton
                    callbackUrl={callbackUrl}
                    className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                    label="Continue with Google"
                  />
                ) : (
                  <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-5 py-3 text-sm text-amber-100">
                    Google OAuth is not configured yet.
                  </div>
                )}
                <span className="text-xs leading-6 text-slate-400">
                  By continuing, you agree to our Terms and Privacy Policy.
                </span>
              </div>
              {!enabled ? (
                <p className="mt-4 text-xs leading-6 text-slate-400">
                  Add `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `AUTH_SECRET` in your
                  local environment to enable login.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>

      {mounted ? createPortal(dialog, document.body) : null}
    </>
  );
}
