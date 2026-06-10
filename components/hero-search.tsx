"use client";

import { useCallback, useTransition, useState } from "react";
import { useRouter } from "next/navigation";

const quickTags = ["AI for Sales", "Free Image Tools", "Code Assistants", "Education"];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback((q: string) => {
    startTransition(() => {
      if (q.trim()) {
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      } else {
        router.push("/search");
      }
    });
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(query);
    }
  }, [query, navigate]);

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/8 p-4 shadow-[0_24px_120px_rgba(8,15,35,0.45)] backdrop-blur-2xl">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          aria-label="Search tools"
          placeholder="Search AI tools by use case, price, or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-2xl border border-white/10 bg-[#071120] px-5 py-4 text-sm text-slate-300 outline-none placeholder:text-slate-500 focus:border-cyan-300/30"
        />
        <button
          onClick={() => navigate(query)}
          disabled={isPending}
          className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4 text-sm font-medium text-white transition hover:border-cyan-300/30 hover:bg-white/10 disabled:opacity-60"
        >
          AI Finder
        </button>
        <button
          onClick={() => navigate(query)}
          disabled={isPending}
          className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
        >
          Search Now
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {quickTags.map((tag) => (
          <button
            key={tag}
            onClick={() => navigate(tag)}
            disabled={isPending}
            className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/20 hover:text-white disabled:opacity-60"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
