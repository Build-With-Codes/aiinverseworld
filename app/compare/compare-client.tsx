"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComparisonTable } from "@/components/comparison-table";
import { SectionHeading } from "@/components/section-heading";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EditorialBlock } from "@/components/ui/editorial-block";
import type { AITool, Comparison } from "@/lib/catalog-types";

type ToolOption = {
  value: string;
  slug: string;
  label: string;
};

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
  const router = useRouter();
  const [left, setLeft] = useState(selectedPair?.left.id ?? "");
  const [right, setRight] = useState(selectedPair?.right.id ?? "");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return comparisons;
    const q = query.toLowerCase();
    return comparisons.filter((c) => c.title.toLowerCase().includes(q));
  }, [comparisons, query]);

  function handleCompare() {
    if (left && right && left !== right) {
      router.push(`/compare?leftId=${encodeURIComponent(left)}&rightId=${encodeURIComponent(right)}`);
    }
  }

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

      <section className="rounded-card-lg border border-border-subtle bg-surface-2 p-8">
        <SectionHeading
          eyebrow="Compare"
          title="Compare any two AI tools"
          description="Pick any two tools from the catalog and get a side-by-side breakdown."
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold tracking-widest text-text-muted uppercase">Tool A</label>
            <select
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              suppressHydrationWarning
              className="w-full rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-slate-200 outline-none focus:border-border-accent"
            >
              <option value="">Select a tool...</option>
              {toolOptions.map((o) => (
                <option key={o.value} value={o.value} disabled={o.value === right}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <span className="shrink-0 text-center text-text-muted font-semibold sm:pb-3">vs</span>

          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold tracking-widest text-text-muted uppercase">Tool B</label>
            <select
              value={right}
              onChange={(e) => setRight(e.target.value)}
              suppressHydrationWarning
              className="w-full rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-slate-200 outline-none focus:border-border-accent"
            >
              <option value="">Select a tool...</option>
              {toolOptions.map((o) => (
                <option key={o.value} value={o.value} disabled={o.value === left}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCompare}
            disabled={!left || !right || left === right}
            className="shrink-0 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40 sm:mb-0"
          >
            Compare
          </button>
        </div>
      </section>

      {selectedPair ? (
        <section className="space-y-6">
          <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-8">
            <SectionHeading
              eyebrow="Selected comparison"
              title={`${selectedPair.left.name} vs ${selectedPair.right.name}`}
              description="This comparison was retrieved by database IDs selected from the catalog."
            />
          </div>
          <ComparisonTable tools={[selectedPair.left, selectedPair.right]} />
        </section>
      ) : null}

      <section className="rounded-card-lg border border-border-subtle bg-surface-2 p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-white">
            {comparisons.length} curated comparisons
          </p>
          <input
            aria-label="Search comparisons"
            placeholder="Search comparisons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            suppressHydrationWarning
            className="w-full rounded-2xl border border-border-subtle bg-surface-1 px-4 py-2.5 text-sm text-text-secondary outline-none placeholder:text-text-muted focus:border-border-accent sm:w-72"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="rounded-[22px] border border-border-subtle bg-surface-1 p-5 transition hover:border-border-accent hover:bg-surface-1"
            >
              <p className="font-semibold text-white">{c.title}</p>
              <p className="mt-2 text-sm leading-6 text-text-muted line-clamp-2">{c.summary}</p>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-text-muted">No comparisons match your search.</p>
        )}
      </section>
    </div>
  );
}
