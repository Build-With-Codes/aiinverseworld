"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";

import { GoogleSignInButton } from "@/components/google-auth-button";

type AuthDialogProps = {
  callbackUrl: string;
  enabled?: boolean;
  triggerClassName?: string;
  triggerLabel?: string;
  title?: string;
  description?: string;
};

export function AuthDialog({
  callbackUrl,
  enabled = true,
  triggerClassName,
  triggerLabel = "Login / Sign Up",
  title = "Join AiverseWorld",
  description = "Create your account or log in with email and password, or continue with Google.",
}: AuthDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      // If click is inside the panel, don't close
      if (panelRef.current?.contains(target)) {
        return;
      }

      // If click is inside container but outside panel, close
      if (containerRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    // Small delay to ensure DOM is ready
    const timerId = setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown, true);
      document.addEventListener("keydown", handleKeyDown);
    }, 0);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl,
      mode,
      name,
      email,
      password,
    });

    setSubmitting(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    window.location.href = callbackUrl;
  }

  const dialog =
    open && mounted ? (
      <div
        ref={containerRef}
        className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4 backdrop-blur-md"
      >
        <div
          ref={panelRef}
          className="auth-dialog__panel relative z-10 my-3 w-full max-w-xl overflow-y-auto rounded-[34px] border border-white/10 shadow-[0_30px_120px_rgba(2,6,23,0.55)] sm:my-0"
          onClick={(e) => e.stopPropagation()}
        >
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

            <div className="mt-2 rounded-[28px] border border-white/10 bg-white/6 p-5 sm:p-6">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-blue-600 text-white dark:bg-white dark:text-slate-950"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    mode === "signup"
                      ? "bg-blue-600 text-white dark:bg-white dark:text-slate-950"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <p className="mt-5 text-sm font-medium text-white">
                {mode === "signup" ? "Create your account" : "Log in to your account"}
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleCredentialsSubmit}>
                {mode === "signup" ? (
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-4 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-[#081222] dark:text-white"
                  />
                ) : null}
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-4 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-[#081222] dark:text-white"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-4 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-white/10 dark:bg-[#081222] dark:text-white"
                />
                {error ? (
                  <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                    {error}
                  </div>
                ) : null}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-200"
                >
                  {submitting
                    ? "Please wait..."
                    : mode === "signup"
                      ? "Create Account"
                      : "Login"}
                </button>
              </form>

              <div className="mt-6 flex items-center">
                <div className="flex-1 border-t border-gray-300 dark:border-white/10"></div>
                <span className="mx-4 text-sm text-gray-500 dark:text-slate-400">OR</span>
                <div className="flex-1 border-t border-gray-300 dark:border-white/10"></div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                {enabled ? (
                  <GoogleSignInButton
                    callbackUrl={callbackUrl}
                    className="rounded-2xl bg-gray-100 border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-200 dark:border-white/10"
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
                  Add `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, and
                  `AUTH_SERVICE_BASE_URL` in your local environment to enable login.
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
