"use client";

import { useState } from "react";

export function RecomputeStatsButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/admin/stats-recompute", { method: "POST" });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.error ?? "Recompute failed.");
      setStatus("done");
      setMessage(`Updated ${payload?.data?.toolsUpdated ?? 0} tools.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Recompute failed.");
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        className="cursor-pointer rounded-pill border border-border-accent bg-brand-cyan/8 px-5 py-2.5 text-sm font-semibold text-brand-cyan-strong transition hover:bg-brand-cyan/12 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Recomputing…" : "Recompute trending stats"}
      </button>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-red-400" : "text-text-muted"}`}>{message}</p>
      ) : null}
    </div>
  );
}
