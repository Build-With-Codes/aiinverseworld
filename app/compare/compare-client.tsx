"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ComparisonTable } from "@/components/comparison-table";
import { FaviconBadge } from "@/components/favicon-badge";
import { SectionHeading } from "@/components/section-heading";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EditorialBlock } from "@/components/ui/editorial-block";
import type { AITool, Comparison } from "@/lib/catalog-types";
import { CompareSelector, type ToolOption } from "./compare-selector";

type CompareClientProps = {
  comparisons: Comparison[];
  toolOptions: ToolOption[];
  selectedPair?: {
    left: AITool;
    right: AITool;
  } | null;
  multiTools?: AITool[];
  recommendation?: string;
};

export function CompareClient({
  comparisons,
  toolOptions,
  selectedPair,
  multiTools,
  recommendation,
}: CompareClientProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return comparisons;
    const q = query.toLowerCase();
    return comparisons.filter((c) => c.title.toLowerCase().includes(q));
  }, [comparisons, query]);

  return (
    <div className="space-y-10 pb-10 pt-6">
      <div className="pt-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
      </div>
      {multiTools && multiTools.length >= 2 ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Your comparison"
            title={multiTools.map((t) => t.name).join(" vs ")}
            description="A side-by-side breakdown of the tools in your compare tray."
          />
          {recommendation ? (
            <EditorialBlock eyebrow="Our pick" title="Which should you choose?" tone="verdict">
              <p>{recommendation}</p>
            </EditorialBlock>
          ) : null}
          <ComparisonTable tools={multiTools} highlightDifferences />
        </section>
      ) : null}

      <section className="grid gap-8 border-b border-border-subtle pb-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
        <SectionHeading
          eyebrow="Compare"
          title="Compare AI tools with a clear side-by-side workflow"
          description="Start with two products, then move into pricing, capability, platform fit, and practical tradeoffs."
        />
        <CompareSelector
          currentLeft={selectedPair?.left.id ?? ""}
          currentRight={selectedPair?.right.id ?? ""}
          toolOptions={toolOptions}
        />
      </section>

      {selectedPair ? (
        <section className="space-y-6">
          <div className="border-b border-border-subtle pb-2">
            <SectionHeading
              eyebrow="Selected comparison"
              title={`${selectedPair.left.name} vs ${selectedPair.right.name}`}
              description="This comparison was retrieved by database IDs selected from the catalog."
            />
          </div>
          <ComparisonTable tools={[selectedPair.left, selectedPair.right]} />
        </section>
      ) : null}

      <section className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-border-subtle pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-eyebrow text-brand-cyan-strong">Trending comparisons</p>
            <h2 className="mt-2 text-heading-1 text-text-primary">{comparisons.length} curated matchups</h2>
          </div>
          <label className="relative block w-full sm:w-80">
            <span className="sr-only">Search comparisons</span>
            <input
              aria-label="Search comparisons"
              placeholder="Search comparisons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              suppressHydrationWarning
              className="platform-input rounded-pill px-4 py-3 text-sm"
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="group flex flex-col gap-4 rounded-card border border-border-subtle bg-surface-2/72 p-5 transition duration-[var(--motion-hover)] hover:-translate-y-0.5 hover:border-border-accent hover:bg-surface-2 hover:shadow-card"
            >
              {c.left && c.right ? (
                <div className="flex items-center gap-3">
                  <FaviconBadge
                    name={c.left.name}
                    faviconUrl={c.left.favicon}
                    className="h-11 w-11 shrink-0 rounded-xl"
                    imgClassName="p-1.5"
                    labelClassName="text-xs"
                  />
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-accent bg-surface-3 text-[10px] font-bold text-brand-cyan-strong"
                  >
                    VS
                  </span>
                  <FaviconBadge
                    name={c.right.name}
                    faviconUrl={c.right.favicon}
                    className="h-11 w-11 shrink-0 rounded-xl"
                    imgClassName="p-1.5"
                    labelClassName="text-xs"
                  />
                </div>
              ) : null}
              <div>
                <p className="font-semibold text-text-primary transition group-hover:text-brand-cyan-strong">
                  {c.title}
                </p>
                <p className="mt-1.5 text-sm leading-6 text-text-muted line-clamp-2">{c.summary}</p>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="border-y border-border-subtle py-10 text-center text-sm text-text-muted">No comparisons match your search.</p>
        )}
      </section>
    </div>
  );
}
