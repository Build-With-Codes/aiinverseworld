"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteBlogPost } from "@/lib/admin-blog-client";

export function BlogRowActions({ slug }: { slug: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteBlogPost(slug);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete post.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/blog/${encodeURIComponent(slug)}/edit`}
        className="text-sm font-semibold text-brand-cyan-strong transition hover:text-brand-cyan"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="cursor-pointer text-sm font-semibold text-red-400 transition hover:text-red-300 disabled:opacity-60"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}
