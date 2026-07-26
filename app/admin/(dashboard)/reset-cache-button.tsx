"use client";

import { useState } from "react";

export function ResetCacheButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    const confirmed = window.confirm("Reset Redis public API cache now?");
    if (!confirmed) return;

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/admin/cache-reset", { method: "POST" });
      const payload = await res.json().catch(() => null);
      if (!res.ok || payload?.ok === false) {
        throw new Error(payload?.message ?? payload?.error ?? "Cache reset failed.");
      }

      setStatus("done");
      setMessage(payload?.message ?? "Redis cache reset.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Cache reset failed.");
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="cursor-pointer rounded-pill border border-border-strong bg-surface-3 px-5 py-2.5 text-sm font-semibold text-text-primary transition hover:border-border-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Resetting cache..." : "Reset Redis cache"}
      </button>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-red-400" : "text-text-muted"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
