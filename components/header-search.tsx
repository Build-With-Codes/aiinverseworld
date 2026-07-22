"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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

  return (
    <form
      role="search"
      aria-label="Search AI tools"
      onSubmit={handleSubmit}
      className="group flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl focus-within:border-cyan-300/35 focus-within:bg-cyan-300/8"
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
  );
}
