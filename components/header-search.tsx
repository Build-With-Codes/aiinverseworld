"use client";

import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, MouseEvent, useRef, useState } from "react";

type HeaderSearchProps = {
  onSubmit?: () => void;
  trendingQueries?: string[];
};

export function HeaderSearch({ onSubmit, trendingQueries = [] }: HeaderSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput(event: MouseEvent) {
    if (event.target !== event.currentTarget) return;
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      inputRef.current?.focus();
    }
  }

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
        onClick={focusInput}
        className="platform-search-shell flex min-w-0 cursor-text items-center gap-1.5 rounded-full px-2.5 py-1 text-text-secondary backdrop-blur-xl transition duration-[var(--motion-hover)] ease-[var(--ease-premium)]"
      >
        <button
          type="submit"
          aria-label="Submit search"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-brand-electric-strong transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:text-text-primary group-focus-within:text-brand-cyan-strong"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
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
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search tools"
          className="platform-shell-input min-w-0 flex-1 appearance-none px-0 py-0 text-[13px] placeholder:text-text-muted focus-visible:outline-none"
        />
    
      </form>

      {trendingQueries.length > 0 ? (
        <div className="app-glass pointer-events-none absolute right-0 top-[calc(100%+10px)] z-50 hidden w-[min(20rem,calc(100vw-2rem))] rounded-card border border-border-subtle bg-surface-1/96 p-2 opacity-0 shadow-[0_24px_70px_rgba(2,6,23,0.42)] backdrop-blur-xl transition group-focus-within/search:pointer-events-auto group-focus-within/search:block group-focus-within/search:opacity-100">
          <div className="flex items-center gap-2 border-b border-border-subtle px-2 pb-2 pt-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-electric/10 text-brand-electric-strong">
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
            <p className="text-xs font-semibold tracking-[0.18em] text-brand-electric-strong uppercase">
              Suggestions
            </p>
          </div>
          <div className="mt-2 space-y-1">
            {trendingQueries.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTrendingSearch(item)}
                className="flex w-full items-center gap-3 rounded-card px-3 py-2.5 text-left text-sm font-medium text-text-secondary transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:bg-brand-electric/10 hover:text-text-primary"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan/70" />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
