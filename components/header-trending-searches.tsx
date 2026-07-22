"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trendingSearches } from "@/lib/trending-searches";

export function HeaderTrendingSearches() {
  const [atTop, setAtTop] = useState(true);
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setAtTop((current) => {
        if (current) {
          return window.scrollY < 48;
        }

        return window.scrollY < 8;
      });
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleFocusChange() {
      setSearchActive(
        Boolean(document.activeElement?.closest("[data-header-search]")),
      );
    }

    handleFocusChange();
    document.addEventListener("focusin", handleFocusChange);
    document.addEventListener("focusout", handleFocusChange);

    return () => {
      document.removeEventListener("focusin", handleFocusChange);
      document.removeEventListener("focusout", handleFocusChange);
    };
  }, []);

  const isVisible = atTop && !searchActive;

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity,margin,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible
          ? "mt-3 translate-y-0 grid-rows-[1fr] opacity-100"
          : "mt-0 -translate-y-2 grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className={`flex justify-center px-1 pb-1 transition-[padding,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? "translate-y-0 pt-0" : "-translate-y-1 pt-0"
          }`}
        >
          <div className="flex max-w-full flex-wrap items-center justify-center gap-2">
            <span className="flex shrink-0 items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-cyan-200">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                <path
                  d="M3 13.5 7.4 9l3 3 5.4-6.5M12.8 5.5h3v3"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
              <span className="flex flex-col text-[10px] font-semibold uppercase leading-none tracking-[0.18em]">
                <span>Trending</span>
                <span className="mt-0.5 text-cyan-100">now</span>
              </span>
            </span>
            {trendingSearches.map((item) => (
              <Link
                key={item}
                href={`/search?q=${encodeURIComponent(item)}`}
                className="shrink-0 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
