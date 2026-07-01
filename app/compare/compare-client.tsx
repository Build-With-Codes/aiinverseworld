"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComparisonTable } from "@/components/comparison-table";
import { SectionHeading } from "@/components/section-heading";
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
};

export function CompareClient({ comparisons, toolOptions, selectedPair }: CompareClientProps) {
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
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Compare"
          title="Compare any two AI tools"
          description="Pick any two tools from the catalog and get a side-by-side breakdown."
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Tool A</label>
            <select
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/10 bg-[#071120] px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-300/30"
            >
              <option value="">Select a tool...</option>
              {toolOptions.map((o) => (
                <option key={o.value} value={o.value} disabled={o.value === right}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <span className="shrink-0 text-center text-slate-500 font-semibold sm:pb-3">vs</span>

          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Tool B</label>
            <select
              value={right}
              onChange={(e) => setRight(e.target.value)}
              suppressHydrationWarning
              className="w-full rounded-2xl border border-white/10 bg-[#071120] px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-300/30"
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
          <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
            <SectionHeading
              eyebrow="Selected comparison"
              title={`${selectedPair.left.name} vs ${selectedPair.right.name}`}
              description="This comparison was retrieved by database IDs selected from the catalog."
            />
          </div>
          <ComparisonTable left={selectedPair.left} right={selectedPair.right} />
        </section>
      ) : null}

      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
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
            className="w-full rounded-2xl border border-white/10 bg-[#071120] px-4 py-2.5 text-sm text-slate-300 outline-none placeholder:text-slate-500 focus:border-cyan-300/30 sm:w-72"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="rounded-[22px] border border-white/10 bg-[#081222] p-5 transition hover:border-cyan-300/30 hover:bg-[#0a1628]"
            >
              <p className="font-semibold text-white">{c.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">{c.summary}</p>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-500">No comparisons match your search.</p>
        )}
      </section>
    </div>
  );
}
