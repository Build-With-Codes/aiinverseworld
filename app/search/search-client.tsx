"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { SectionHeading } from "@/components/section-heading";
import { ToolGridSkeleton } from "@/components/loading-skeletons";
import type { AITool, Category } from "@/lib/catalog-types";
import type { Pagination } from "@/lib/tool-catalog";

type Props = {
  initialTools: AITool[];
  categories: Category[];
  initialQuery: string;
  pagination: Pagination;
};

const allPricing = ["Free", "Freemium", "Subscription", "Usage-based", "Enterprise", "Custom"];

export function SearchClient({ initialTools, categories, initialQuery, pagination }: Props) {
  const firstRenderRef = useRef(true);
  const [tools, setTools] = useState(initialTools);
  const [currentPagination, setCurrentPagination] = useState(pagination);
  const [query, setQuery] = useState(initialQuery);
  const [draftQuery, setDraftQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [pricing, setPricing] = useState("");
  const [platform, setPlatform] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [apiOnly, setApiOnly] = useState(false);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [page, setPage] = useState(pagination.page);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const allCategories = categories.map((item) => item.name).sort();
  const allPlatforms = Array.from(new Set(tools.flatMap((t) => t.platforms))).sort();

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
        page: String(page),
        limit: "24",
      });

      if (query.trim()) params.set("q", query.trim());
      if (category) params.set("category", category);
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
        browserParams.toString() ? `/search?${browserParams.toString()}` : "/search",
      );

      try {
        const response = await fetch(`/api/tools?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const payload = (await response.json()) as {
          data?: AITool[];
          pagination?: Pagination;
        };

        setTools(payload.data ?? []);
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

        setTools([]);
        setCurrentPagination({ page: 1, limit: 24, total: 0, totalPages: 1 });
        setError("Could not load tools from the API. Check that the backend is running.");
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [apiOnly, category, freeOnly, openSourceOnly, page, platform, pricing, query]);

  function clearAll() {
    setQuery("");
    setDraftQuery("");
    setCategory("");
    setPricing("");
    setPlatform("");
    setFreeOnly(false);
    setApiOnly(false);
    setOpenSourceOnly(false);
    setPage(1);
  }

  const hasFilters = query || category || pricing || platform || freeOnly || apiOnly || openSourceOnly;

  function toggleDropdown(name: string) {
    setActiveDropdown((prev) => (prev === name ? null : name));
  }

  function updateQuery(value: string) {
    setDraftQuery(value);
  }

  function submitSearch() {
    setQuery(draftQuery.trim());
    setPage(1);
  }

  function updateCategory(value: string) {
    setCategory(value);
    setPlatform("");
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
      <section className="rounded-card-lg border border-border-subtle bg-surface-2 p-8">
        <SectionHeading
          eyebrow="Catalog Search"
          title="Filter AI tools by workflow, price, and platform"
          description="Use the live catalog controls to narrow assistants, generators, automation apps, and developer tools without repeating the homepage discovery flow."
        />

        <form
          className="platform-search-shell mb-4 flex flex-col gap-3 rounded-card p-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
        >
          <input
            aria-label="Search query"
            placeholder="Example: I need AI for summarizing PDFs and research"
            value={draftQuery}
            onChange={(e) => updateQuery(e.target.value)}
            className="platform-shell-input min-w-0 flex-1 px-4 py-3 text-sm placeholder:text-text-muted"
          />
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-brand-electric to-brand-violet px-6 py-4 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              onClick={() => toggleDropdown("category")}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${category ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong" : "border-border-subtle bg-surface-1 text-slate-200 hover:border-border-accent"}`}
            >
              {category || "Category"} v
            </button>
            {activeDropdown === "category" && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[180px] rounded-sm border border-border-subtle bg-surface-1 p-2 shadow-xl">
                <button onClick={() => { updateCategory(""); setActiveDropdown(null); }} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-2">All</button>
                {allCategories.map((c) => (
                  <button key={c} onClick={() => { updateCategory(c); setActiveDropdown(null); }} className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface-2 ${category === c ? "text-brand-cyan-strong" : "text-slate-200"}`}>{c}</button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => toggleDropdown("pricing")}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${pricing ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong" : "border-border-subtle bg-surface-1 text-slate-200 hover:border-border-accent"}`}
            >
              {pricing || "Pricing"} v
            </button>
            {activeDropdown === "pricing" && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-sm border border-border-subtle bg-surface-1 p-2 shadow-xl">
                <button onClick={() => { updatePricing(""); setActiveDropdown(null); }} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-2">All</button>
                {allPricing.map((p) => (
                  <button key={p} onClick={() => { updatePricing(p); setActiveDropdown(null); }} className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface-2 ${pricing === p ? "text-brand-cyan-strong" : "text-slate-200"}`}>{p}</button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => toggleDropdown("platform")}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${platform ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong" : "border-border-subtle bg-surface-1 text-slate-200 hover:border-border-accent"}`}
            >
              {platform || "Platform"} v
            </button>
            {activeDropdown === "platform" && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-sm border border-border-subtle bg-surface-1 p-2 shadow-xl">
                <button onClick={() => { updatePlatform(""); setActiveDropdown(null); }} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-2">All</button>
                {allPlatforms.map((p) => (
                  <button key={p} onClick={() => { updatePlatform(p); setActiveDropdown(null); }} className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface-2 ${platform === p ? "text-brand-cyan-strong" : "text-slate-200"}`}>{p}</button>
                ))}
              </div>
            )}
          </div>

          {[
            { label: "Free Plan", active: freeOnly, toggle: toggleFreeOnly },
            { label: "API", active: apiOnly, toggle: toggleApiOnly },
            { label: "Open Source", active: openSourceOnly, toggle: toggleOpenSourceOnly },
          ].map(({ label, active, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${active ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-300" : "border-border-subtle bg-surface-1 text-slate-200 hover:border-border-accent"}`}
            >
              {label}
            </button>
          ))}

          {hasFilters && (
            <button onClick={clearAll} className="rounded-2xl border border-border-subtle px-4 py-2.5 text-sm text-text-muted transition hover:text-white">
              Clear all x
            </button>
          )}

          <span className="ml-auto text-sm text-text-muted">{resultCountLabel}</span>
        </div>
      </section>

      {isLoading ? (
        <ToolGridSkeleton count={9} />
      ) : error ? (
        <div className="rounded-card border border-rose-300/20 bg-rose-300/8 p-10 text-center text-sm text-rose-100">
          {error}
        </div>
      ) : tools.length > 0 ? (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </section>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border-subtle bg-surface-2 p-5 text-sm text-text-secondary">
            <span>
              Page {currentPagination.page} of {currentPagination.totalPages} | {currentPagination.total} tools
            </span>
            <div className="flex gap-2">
              <button
                aria-disabled={currentPagination.page <= 1}
                disabled={currentPagination.page <= 1}
                className={`rounded-2xl border border-border-subtle px-4 py-2 ${currentPagination.page <= 1 ? "pointer-events-none opacity-40" : "hover:border-border-accent hover:text-white"}`}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </button>
              <button
                aria-disabled={currentPagination.page >= currentPagination.totalPages}
                disabled={currentPagination.page >= currentPagination.totalPages}
                className={`rounded-2xl border border-border-subtle px-4 py-2 ${currentPagination.page >= currentPagination.totalPages ? "pointer-events-none opacity-40" : "hover:border-border-accent hover:text-white"}`}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-card border border-border-subtle bg-surface-2 p-10 text-center text-sm text-text-muted">
          No tools match your current filters. Try describing the job in simpler words.
        </div>
      )}
    </div>
  );
}
