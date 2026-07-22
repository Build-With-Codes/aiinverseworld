"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { trendingSearches } from "@/lib/trending-searches";

type HeaderSearchProps = {
  onSubmit?: () => void;
};

export function HeaderSearch({ onSubmit }: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
    onSubmit?.();
  }

  function handleTrendingSearch(value: string) {
    setQuery(value);
    router.push(`/search?q=${encodeURIComponent(value)}`);
    onSubmit?.();
  }

  return (
    <div className="group/search relative min-w-0" data-header-search>
      <form
        role="search"
        aria-label="Search AI tools"
        onSubmit={handleSubmit}
        className="flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl focus-within:border-cyan-300/35 focus-within:bg-cyan-300/8"
      >
        <button
          type="submit"
          aria-label="Submit search"
          className="flex h-6 w-6 shrink-0 items-center justify-center text-cyan-200 transition hover:text-white group-focus-within:text-cyan-100"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4.5 w-4.5">
            <path
              d="m14.2 14.2 3.3 3.3M8.8 15.2a6.4 6.4 0 1 1 0-12.8 6.4 6.4 0 0 1 0 12.8Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
        </button>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools"
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
        />
      </form>

      <div className="app-glass pointer-events-none absolute right-0 top-[calc(100%+10px)] z-50 hidden w-[min(20rem,calc(100vw-2rem))] rounded-[26px] border border-white/10 bg-[#071120]/96 p-2 opacity-0 shadow-[0_24px_70px_rgba(2,6,23,0.42)] backdrop-blur-xl transition group-focus-within/search:pointer-events-auto group-focus-within/search:block group-focus-within/search:opacity-100">
        <div className="flex items-center gap-2 border-b border-white/10 px-2 pb-2 pt-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-200">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path
                d="m14.2 14.2 3.3 3.3M8.8 15.2a6.4 6.4 0 1 1 0-12.8 6.4 6.4 0 0 1 0 12.8Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </span>
          <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase">
            Suggestions
          </p>
        </div>
        <div className="mt-2 space-y-1">
          {trendingSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleTrendingSearch(item)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-slate-200 transition hover:bg-cyan-300/10 hover:text-white"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/70" />
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
