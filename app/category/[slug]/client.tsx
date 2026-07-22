"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ToolGridSkeleton } from "@/components/loading-skeletons";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import type { AITool, Category } from "@/lib/catalog-types";
import type { Pagination } from "@/lib/tool-catalog";

type Props = {
  category: Category;
  tools: AITool[];
  pagination: Pagination;
  lastUpdated?: {
    date: string;
    label: string;
  };
};

const allPricing = ["Free", "Freemium", "Subscription", "Usage-based", "Enterprise", "Custom"];

export function CategoryPageClient({ category, tools, pagination, lastUpdated }: Props) {
  const firstRenderRef = useRef(true);
  const [currentTools, setCurrentTools] = useState(tools);
  const [currentPagination, setCurrentPagination] = useState(pagination);
  const [query, setQuery] = useState("");
  const [pricing, setPricing] = useState("");
  const [platform, setPlatform] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [apiOnly, setApiOnly] = useState(false);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [page, setPage] = useState(pagination.page);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricingDropdown, setPricingDropdown] = useState(false);
  const [platformDropdown, setPlatformDropdown] = useState(false);

  const allPlatforms = Array.from(new Set(currentTools.flatMap((tool) => tool.platforms))).sort();
  const hasFilters = query || pricing || platform || freeOnly || apiOnly || openSourceOnly;

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        category: category.name,
        page: String(page),
        limit: "24",
      });

      if (query.trim()) params.set("q", query.trim());
      if (pricing) params.set("pricing", pricing);
      if (platform) params.set("platform", platform);
      if (freeOnly) params.set("freeOnly", "true");
      if (apiOnly) params.set("apiOnly", "true");
      if (openSourceOnly) params.set("openSourceOnly", "true");

      const browserParams = new URLSearchParams();
      if (query.trim()) browserParams.set("q", query.trim());
      if (page > 1) browserParams.set("page", String(page));
      window.history.replaceState(
        null,
        "",
        browserParams.toString()
          ? `/category/${category.slug}?${browserParams.toString()}`
          : `/category/${category.slug}`,
      );

      try {
        const response = await fetch(`/api/tools?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Category request failed");
        }

        const payload = (await response.json()) as {
          data?: AITool[];
          pagination?: Pagination;
        };

        setCurrentTools(payload.data ?? []);
        setCurrentPagination(
          payload.pagination ?? {
            page,
            limit: 24,
            total: payload.data?.length ?? 0,
            totalPages: 1,
          },
        );
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setCurrentTools([]);
        setCurrentPagination({ page: 1, limit: 24, total: 0, totalPages: 1 });
        setError("Could not load category tools from the API. Check that the backend is running.");
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [apiOnly, category.name, category.slug, freeOnly, openSourceOnly, page, platform, pricing, query]);

  function clearAll() {
    setQuery("");
    setPricing("");
    setPlatform("");
    setFreeOnly(false);
    setApiOnly(false);
    setOpenSourceOnly(false);
    setPage(1);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updatePricing(value: string) {
    setPricing(value);
    setPage(1);
  }

  function updatePlatform(value: string) {
    setPlatform(value);
    setPage(1);
  }

  function toggleFreeOnly() {
    setFreeOnly((value) => !value);
    setPage(1);
  }

  function toggleApiOnly() {
    setApiOnly((value) => !value);
    setPage(1);
  }

  function toggleOpenSourceOnly() {
    setOpenSourceOnly((value) => !value);
    setPage(1);
  }

  const resultCountLabel = useMemo(() => {
    if (isLoading) return "Searching API...";
    return `${currentPagination.total} tool${currentPagination.total !== 1 ? "s" : ""}`;
  }, [currentPagination.total, isLoading]);

  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Category"
          title={`${category.name} tools`}
          description={category.description}
        />
        {lastUpdated ? (
          <p className="mb-5 text-sm font-medium text-slate-400">
            Last updated <time dateTime={lastUpdated.date}>{lastUpdated.label}</time>
          </p>
        ) : null}

        <div className="mb-4">
          <input
            aria-label="Filter tools"
            placeholder={`Search within ${category.name}...`}
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            suppressHydrationWarning
            className="w-full rounded-2xl border border-white/10 bg-[#071120] px-5 py-4 text-sm text-slate-300 outline-none placeholder:text-slate-500 focus:border-cyan-300/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setPricingDropdown((value) => !value);
                setPlatformDropdown(false);
              }}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${pricing ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-[#081222] text-slate-200 hover:border-cyan-300/30"}`}
            >
              {pricing || "Pricing"} v
            </button>
            {pricingDropdown ? (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-[20px] border border-white/10 bg-[#071120] p-2 shadow-xl">
                <button
                  onClick={() => {
                    updatePricing("");
                    setPricingDropdown(false);
                  }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5"
                >
                  All
                </button>
                {allPricing.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      updatePricing(item);
                      setPricingDropdown(false);
                    }}
                    className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/5 ${pricing === item ? "text-cyan-300" : "text-slate-200"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {allPlatforms.length > 0 ? (
            <div className="relative">
              <button
                onClick={() => {
                  setPlatformDropdown((value) => !value);
                  setPricingDropdown(false);
                }}
                className={`rounded-2xl border px-4 py-2.5 text-sm transition ${platform ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-[#081222] text-slate-200 hover:border-cyan-300/30"}`}
              >
                {platform || "Platform"} v
              </button>
              {platformDropdown ? (
                <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-[20px] border border-white/10 bg-[#071120] p-2 shadow-xl">
                  <button
                    onClick={() => {
                      updatePlatform("");
                      setPlatformDropdown(false);
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5"
                  >
                    All
                  </button>
                  {allPlatforms.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        updatePlatform(item);
                        setPlatformDropdown(false);
                      }}
                      className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/5 ${platform === item ? "text-cyan-300" : "text-slate-200"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {[
            { label: "Free Plan", active: freeOnly, toggle: toggleFreeOnly },
            { label: "API", active: apiOnly, toggle: toggleApiOnly },
            { label: "Open Source", active: openSourceOnly, toggle: toggleOpenSourceOnly },
          ].map(({ label, active, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${active ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-300" : "border-white/10 bg-[#081222] text-slate-200 hover:border-cyan-300/30"}`}
            >
              {label}
            </button>
          ))}

          {hasFilters ? (
            <button
              onClick={clearAll}
              className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition hover:text-white"
            >
              Clear all x
            </button>
          ) : null}

          <span className="ml-auto text-sm text-slate-500">{resultCountLabel}</span>
        </div>
      </section>

      {isLoading ? (
        <ToolGridSkeleton count={9} />
      ) : error ? (
        <div className="rounded-[28px] border border-rose-300/20 bg-rose-300/8 p-10 text-center text-sm text-rose-100">
          {error}
        </div>
      ) : currentTools.length > 0 ? (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            {currentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </section>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/10 bg-white/6 p-5 text-sm text-slate-300">
            <span>
              Page {currentPagination.page} of {currentPagination.totalPages} | {currentPagination.total} tools
            </span>
            <div className="flex gap-2">
              <button
                aria-disabled={currentPagination.page <= 1}
                disabled={currentPagination.page <= 1}
                className={`rounded-2xl border border-white/10 px-4 py-2 ${currentPagination.page <= 1 ? "pointer-events-none opacity-40" : "hover:border-cyan-300/30 hover:text-white"}`}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </button>
              <button
                aria-disabled={currentPagination.page >= currentPagination.totalPages}
                disabled={currentPagination.page >= currentPagination.totalPages}
                className={`rounded-2xl border border-white/10 px-4 py-2 ${currentPagination.page >= currentPagination.totalPages ? "pointer-events-none opacity-40" : "hover:border-cyan-300/30 hover:text-white"}`}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-10 text-center text-sm text-slate-400">
          No tools match your filters. Try adjusting or clearing them.
        </div>
      )}
    </div>
  );
}
