"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { reindexTool } from "@/lib/admin-tools-client";

export function ToolRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [reindexing, setReindexing] = useState(false);

  async function handleReindex() {
    setReindexing(true);
    try {
      await reindexTool(id);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to reindex tool.");
    } finally {
      setReindexing(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/tools/${encodeURIComponent(id)}/edit`}
        className="text-sm font-semibold text-brand-cyan-strong transition hover:text-brand-cyan"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleReindex}
        disabled={reindexing}
        className="cursor-pointer text-sm font-semibold text-text-secondary transition hover:text-text-primary disabled:opacity-60"
      >
        {reindexing ? "Reindexing…" : "Reindex"}
      </button>
    </div>
  );
}
