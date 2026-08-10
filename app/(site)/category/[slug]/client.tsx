"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ToolGridSkeleton } from "@/components/loading-skeletons";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { ComparisonTable } from "@/components/comparison-table";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cardClass } from "@/components/ui/card";
import { EditorialBlock } from "@/components/ui/editorial-block";
import { EmptyState } from "@/components/ui/empty-state";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { FadeInSection } from "@/components/ui/motion";
import type { CategoryContent } from "@/lib/category-content";
import type { AITool, Category } from "@/lib/catalog-types";
import { CategoryIcon, getCategoryTone } from "@/lib/category-visuals";
import type { Pagination } from "@/lib/tool-catalog";

type Props = {
  category: Category;
  tools: AITool[];
  pagination: Pagination;
  lastUpdated?: {
    date: string;
    label: string;
  };
  content: CategoryContent;
};

const allPricing = ["Free", "Freemium", "Subscription", "Usage-based", "Enterprise", "Custom"];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CategoryPageClient({ category, tools, pagination, lastUpdated, content }: Props) {
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

  const comparisonTools = tools.slice(0, 2);
  const tone = getCategoryTone(category.slug);

  return (
    <div className="space-y-12 pb-10 pt-6">
      <div className="pt-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/category" },
            { label: category.name },
          ]}
        />
      </div>
      {/* Unique introduction + category explanation */}
      <FadeInSection className={`overflow-hidden ${cardClass({ padding: "none", radius: "card-lg" })}`}>
        <div className="premium-gradient h-1 w-full" aria-hidden />
        <div className="p-8">
          <div className="flex flex-wrap items-start gap-5">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${tone.badge} ${tone.icon}`}>
              <CategoryIcon name={category.name} className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">Category</Badge>
                <span className={`text-caption font-semibold ${tone.text}`}>
                  {category.count} tool{category.count === 1 ? "" : "s"} listed
                </span>
              </div>
              <h1 className="text-display-2 mt-3 text-text-primary">{category.name} tools</h1>
              {lastUpdated ? (
                <p className="text-caption mt-3 text-text-muted">
                  Last updated <time dateTime={lastUpdated.date}>{lastUpdated.label}</time>
                </p>
              ) : null}
            </div>
          </div>
          <p className="text-body-lg mt-5 max-w-3xl text-text-secondary">{content.intro}</p>
          <p className="text-body mt-4 max-w-3xl text-text-secondary">{content.explanation}</p>
        </div>
      </FadeInSection>

      {/* Top picks — immediate value before the user has to engage with any
          filter UI. Real data: the top 3 of the category's own ranked list. */}
      {tools.length >= 3 ? (
        <div>
          <SectionHeading eyebrow="Top Picks" title={`Where most people start`} />
          <div className="grid gap-6 sm:grid-cols-3">
            {tools.slice(0, 3).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Best tools — filterable grid */}
      <div className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <SectionHeading eyebrow="Best Tools" title={`Filter ${category.name} tools`} description={category.description} />

        <div className="mb-4">
          <input
            aria-label="Filter tools"
            placeholder={`Search within ${category.name}...`}
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            suppressHydrationWarning
            className="platform-input px-5 py-4 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setPricingDropdown((value) => !value);
                setPlatformDropdown(false);
              }}
              className={`inline-flex items-center gap-1.5 rounded-pill border px-4 py-2.5 text-sm font-medium transition ${pricing ? "border-brand-cyan-strong/40 bg-brand-cyan/10 text-brand-cyan-strong" : "border-border-subtle bg-surface-1 text-text-secondary hover:border-border-accent"}`}
            >
              {pricing || "Pricing"}
              <ChevronIcon open={pricingDropdown} />
            </button>
            {pricingDropdown ? (
              <div className={`absolute left-0 top-[calc(100%+8px)] z-50 min-w-[170px] p-1.5 shadow-card-hover ${cardClass({ padding: "none", radius: "card" })}`}>
                <button
                  onClick={() => {
                    updatePricing("");
                    setPricingDropdown(false);
                  }}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-3"
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
                    className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface-3 ${pricing === item ? "font-semibold text-brand-cyan-strong" : "text-text-secondary"}`}
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
                className={`inline-flex items-center gap-1.5 rounded-pill border px-4 py-2.5 text-sm font-medium transition ${platform ? "border-brand-cyan-strong/40 bg-brand-cyan/10 text-brand-cyan-strong" : "border-border-subtle bg-surface-1 text-text-secondary hover:border-border-accent"}`}
              >
                {platform || "Platform"}
                <ChevronIcon open={platformDropdown} />
              </button>
              {platformDropdown ? (
                <div className={`absolute left-0 top-[calc(100%+8px)] z-50 min-w-[170px] p-1.5 shadow-card-hover ${cardClass({ padding: "none", radius: "card" })}`}>
                  <button
                    onClick={() => {
                      updatePlatform("");
                      setPlatformDropdown(false);
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm text-text-muted hover:bg-surface-3"
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
                      className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-surface-3 ${platform === item ? "font-semibold text-brand-cyan-strong" : "text-text-secondary"}`}
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
              className={`inline-flex items-center gap-1.5 rounded-pill border px-4 py-2.5 text-sm font-medium transition ${active ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-border-subtle bg-surface-1 text-text-secondary hover:border-border-accent"}`}
            >
              {active ? (
                <span aria-hidden className="text-emerald-300">
                  ✓
                </span>
              ) : null}
              {label}
            </button>
          ))}

          {hasFilters ? (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 rounded-pill border border-border-subtle px-4 py-2.5 text-sm text-text-muted transition hover:text-text-primary"
            >
              Clear all ✕
            </button>
          ) : null}

          <span className="ml-auto text-sm text-text-muted">{resultCountLabel}</span>
        </div>
      </div>

      {isLoading ? (
        <ToolGridSkeleton count={9} />
      ) : error ? (
        <div className="rounded-card-lg border border-rose-300/20 bg-rose-300/8 p-10 text-center text-sm text-rose-100">
          {error}
        </div>
      ) : currentTools.length > 0 ? (
        <>
          <section className="grid gap-6 lg:grid-cols-3">
            {currentTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </section>
          <div className={`flex flex-wrap items-center justify-between gap-3 text-sm text-text-secondary ${cardClass({ padding: "sm" })}`}>
            <span>
              Page {currentPagination.page} of {currentPagination.totalPages} | {currentPagination.total} tools
            </span>
            <div className="flex gap-2">
              <button
                aria-disabled={currentPagination.page <= 1}
                disabled={currentPagination.page <= 1}
                className={`rounded-pill border border-border-subtle px-4 py-2 font-medium ${currentPagination.page <= 1 ? "pointer-events-none opacity-40" : "hover:border-border-accent hover:text-text-primary"}`}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                Previous
              </button>
              <button
                aria-disabled={currentPagination.page >= currentPagination.totalPages}
                disabled={currentPagination.page >= currentPagination.totalPages}
                className={`rounded-pill border border-border-subtle px-4 py-2 font-medium ${currentPagination.page >= currentPagination.totalPages ? "pointer-events-none opacity-40" : "hover:border-border-accent hover:text-text-primary"}`}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          title="No tools match those filters"
          description={`Try a broader search, or clear filters to see all ${category.count} ${category.name.toLowerCase()} tools.`}
          primaryAction={{ label: "Clear filters", onClick: clearAll }}
          secondaryAction={{ label: "Browse all categories", href: "/category" }}
        />
      )}

      {/* Comparison */}
      {comparisonTools.length === 2 ? (
        <div>
          <SectionHeading
            eyebrow="Comparison"
            title={`${comparisonTools[0].name} vs ${comparisonTools[1].name}`}
            description={`Two of the top ${category.name} tools, compared side by side.`}
          />
          <ComparisonTable tools={comparisonTools} />
        </div>
      ) : null}

      {/* Buying guide */}
      <EditorialBlock eyebrow="Buying Guide" title={`How to choose a ${category.name.toLowerCase()} tool`}>
        <ul className="space-y-3">
          {content.buyingGuide.map((tip) => (
            <li key={tip} className="flex items-start gap-3">
              <span className="mt-1 text-brand-cyan-strong" aria-hidden>→</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </EditorialBlock>

      {/* FAQs */}
      <div>
        <SectionHeading eyebrow="FAQ" title={`Common questions about ${category.name.toLowerCase()} tools`} />
        <FAQAccordion items={content.faqs} />
      </div>
    </div>
  );
}
