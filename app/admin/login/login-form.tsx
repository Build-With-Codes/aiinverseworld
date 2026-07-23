"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { cardClass } from "@/components/ui/card";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Invalid password.");
        return;
      }

      const destination = searchParams.get("from") || "/admin";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-sm space-y-5 ${cardClass({ padding: "lg", radius: "card-lg" })}`}
    >
      <div className="space-y-1.5">
        <p className="text-eyebrow text-brand-cyan-strong">Admin</p>
        <h1 className="text-heading-1 text-text-primary">Sign in</h1>
        <p className="text-body text-text-secondary">
          Enter the admin key to manage blog posts and moderate reviews.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-sm font-medium text-text-secondary">
          Admin key
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-sm border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-border-accent"
          placeholder="••••••••"
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting || password.length === 0}
        className="w-full cursor-pointer rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-5 py-3 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
