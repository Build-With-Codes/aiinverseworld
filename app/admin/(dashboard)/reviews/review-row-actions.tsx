"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReviewRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to delete review.");
      }
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete review.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="cursor-pointer text-sm font-semibold text-red-400 transition hover:text-red-300 disabled:opacity-60"
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
