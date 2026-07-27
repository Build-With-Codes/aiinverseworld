"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";

import { GoogleSignInButton } from "@/components/google-auth-button";

type AuthDialogProps = {
  callbackUrl: string;
  enabled?: boolean;
  triggerClassName?: string;
  triggerLabel?: ReactNode;
  title?: string;
  description?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFriendlyAuthError(message?: string | null) {
  if (!message) {
    return "We could not complete sign in. Please try again.";
  }

  const normalized = message.toLowerCase();

  if (
    normalized.includes("credentials") ||
    normalized.includes("unauthorized") ||
    normalized.includes("invalid") ||
    normalized.includes("password")
  ) {
    return "The email or password does not look right. Please check and try again.";
  }

  if (normalized.includes("already") || normalized.includes("exists")) {
    return "An account with this email already exists. Try logging in instead.";
  }

  if (normalized.includes("fetch") || normalized.includes("network") || normalized.includes("econnrefused")) {
    return "We could not reach the sign-in service. Please try again in a moment.";
  }

  return "We could not complete sign in. Please check your details and try again.";
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    setError("");

    if (mode === "signup" && trimmedName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl,
        mode,
        name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (result?.error) {
        setError(getFriendlyAuthError(result.error));
        return;
      }

      if (!result?.ok) {
        setError("We could not complete sign in. Please try again.");
        return;
      }

      window.location.href = callbackUrl;
    } catch (error) {
      setError(getFriendlyAuthError(error instanceof Error ? error.message : null));
    } finally {
      setSubmitting(false);
    }
  }

  const dialog =
    open ? (
      <div
        ref={containerRef}
        data-auth-dialog="true"
        className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-md sm:items-center sm:p-4"
      >
        <div
          ref={panelRef}
          className="auth-dialog__panel relative z-10 my-3 w-full max-w-[27rem] overflow-hidden rounded-card border border-border-subtle shadow-[0_24px_90px_rgba(2,6,23,0.5)] sm:my-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="auth-dialog__content bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.03))] p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex rounded-full border border-border-accent bg-brand-cyan/10 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-brand-cyan-strong uppercase">
                  Account Access
                </span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  {title}
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                  {description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="auth-dialog__close shrink-0 rounded-full border border-border-subtle px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-border-accent hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-[22px] border border-border-subtle bg-surface-2 p-3.5 sm:p-4">
              <div className="grid rounded-2xl border border-border-subtle bg-surface-1/80 p-1 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  disabled={submitting}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    mode === "login"
                      ? "bg-white text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
                      : "text-text-muted hover:bg-surface-2 hover:text-white disabled:opacity-60"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  disabled={submitting}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    mode === "signup"
                      ? "bg-white text-slate-950 shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
                      : "text-text-muted hover:bg-surface-2 hover:text-white disabled:opacity-60"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <p className="mt-4 text-sm font-medium text-white">
                {mode === "signup" ? "Create your account" : "Log in to your account"}
              </p>

              <form className="mt-4 space-y-3" onSubmit={handleCredentialsSubmit}>
                {mode === "signup" ? (
                  <input
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Full name"
                    autoComplete="name"
                    minLength={2}
                    required={mode === "signup"}
                    disabled={submitting}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-border-subtle dark:bg-surface-1 dark:text-white"
                  />
                ) : null}
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  disabled={submitting}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-border-subtle dark:bg-surface-1 dark:text-white"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  minLength={8}
                  required
                  disabled={submitting}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-border-subtle dark:bg-surface-1 dark:text-white"
                />
                {error ? (
                  <div role="alert" className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
                    {error}
                  </div>
                ) : null}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-cyan-500 px-5 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(34,211,238,0.18)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting
                    ? "Signing in..."
                    : mode === "signup"
                      ? "Create Account"
                      : "Login"}
                </button>
              </form>

              <div className="mt-5 flex items-center">
                <div className="flex-1 border-t border-gray-300 dark:border-border-subtle"></div>
                <span className="mx-3 text-xs font-medium text-gray-500 dark:text-text-muted">OR</span>
                <div className="flex-1 border-t border-gray-300 dark:border-border-subtle"></div>
              </div>

              <div className="mt-4 grid gap-3">
                {enabled ? (
                  <GoogleSignInButton
                    callbackUrl={callbackUrl}
                    disabled={submitting}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-border-subtle dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-100"
                    label="Continue with Google"
                  />
                ) : (
                  <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 px-5 py-3 text-sm text-amber-100">
                    Google OAuth is not configured yet.
                  </div>
                )}
                <span className="text-center text-xs leading-5 text-text-muted">
                  By continuing, you agree to our Terms and Privacy Policy.
                </span>
              </div>
              {!enabled ? (
                <p className="mt-4 text-xs leading-6 text-text-muted">
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

      {typeof document !== "undefined" ? createPortal(dialog, document.body) : null}
    </>
  );
}
