"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ToolCard } from "@/components/tool-card";
import { SectionHeading } from "@/components/section-heading";
import { tools } from "@/lib/site-data";

const allCategories = Array.from(new Set(tools.map((t) => t.category))).sort();
const allPricing = ["Free", "Freemium", "Subscription", "Usage-based", "Enterprise", "Custom"];
const allPlatforms = Array.from(new Set(tools.flatMap((t) => t.platforms))).sort();

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("");
  const [pricing, setPricing] = useState("");
  const [platform, setPlatform] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [apiOnly, setApiOnly] = useState(false);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      if (query) {
        const q = query.toLowerCase();
        const match =
          tool.name.toLowerCase().includes(q) ||
          tool.shortDescription.toLowerCase().includes(q) ||
          tool.tags.some((t) => t.toLowerCase().includes(q)) ||
          tool.category.toLowerCase().includes(q) ||
          tool.company.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (category && tool.category !== category) return false;
      if (pricing && tool.pricingModel !== pricing) return false;
      if (platform && !tool.platforms.includes(platform)) return false;
      if (freeOnly && tool.freePlan !== "Yes") return false;
      if (apiOnly && !tool.apiAvailable) return false;
      if (openSourceOnly && !tool.openSource) return false;
      return true;
    });
  }, [query, category, pricing, platform, freeOnly, apiOnly, openSourceOnly]);

  function clearAll() {
    setQuery("");
    setCategory("");
    setPricing("");
    setPlatform("");
    setFreeOnly(false);
    setApiOnly(false);
    setOpenSourceOnly(false);
  }

  const hasFilters = query || category || pricing || platform || freeOnly || apiOnly || openSourceOnly;

  function toggleDropdown(name: string) {
    setActiveDropdown((prev) => (prev === name ? null : name));
  }

  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Search"
          title="Instant discovery with practical filters"
          description="Search across real tools, pricing signals, platforms, and use cases from the live catalog."
        />

        <div className="mb-4">
          <input
            aria-label="Search query"
            placeholder="Search by name, tag, category, or company…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#071120] px-5 py-4 text-sm text-slate-300 outline-none placeholder:text-slate-500 focus:border-cyan-300/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("category")}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${category ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-[#081222] text-slate-200 hover:border-cyan-300/30"}`}
            >
              {category || "Category"} ▾
            </button>
            {activeDropdown === "category" && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[180px] rounded-[20px] border border-white/10 bg-[#071120] p-2 shadow-xl">
                <button onClick={() => { setCategory(""); setActiveDropdown(null); }} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5">All</button>
                {allCategories.map((c) => (
                  <button key={c} onClick={() => { setCategory(c); setActiveDropdown(null); }} className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/5 ${category === c ? "text-cyan-300" : "text-slate-200"}`}>{c}</button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("pricing")}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${pricing ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-[#081222] text-slate-200 hover:border-cyan-300/30"}`}
            >
              {pricing || "Pricing"} ▾
            </button>
            {activeDropdown === "pricing" && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-[20px] border border-white/10 bg-[#071120] p-2 shadow-xl">
                <button onClick={() => { setPricing(""); setActiveDropdown(null); }} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5">All</button>
                {allPricing.map((p) => (
                  <button key={p} onClick={() => { setPricing(p); setActiveDropdown(null); }} className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/5 ${pricing === p ? "text-cyan-300" : "text-slate-200"}`}>{p}</button>
                ))}
              </div>
            )}
          </div>

          {/* Platform */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("platform")}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${platform ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-[#081222] text-slate-200 hover:border-cyan-300/30"}`}
            >
              {platform || "Platform"} ▾
            </button>
            {activeDropdown === "platform" && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[160px] rounded-[20px] border border-white/10 bg-[#071120] p-2 shadow-xl">
                <button onClick={() => { setPlatform(""); setActiveDropdown(null); }} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/5">All</button>
                {allPlatforms.map((p) => (
                  <button key={p} onClick={() => { setPlatform(p); setActiveDropdown(null); }} className={`block w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/5 ${platform === p ? "text-cyan-300" : "text-slate-200"}`}>{p}</button>
                ))}
              </div>
            )}
          </div>

          {[
            { label: "Free Plan", active: freeOnly, toggle: () => setFreeOnly((v) => !v) },
            { label: "API", active: apiOnly, toggle: () => setApiOnly((v) => !v) },
            { label: "Open Source", active: openSourceOnly, toggle: () => setOpenSourceOnly((v) => !v) },
          ].map(({ label, active, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition ${active ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-300" : "border-white/10 bg-[#081222] text-slate-200 hover:border-cyan-300/30"}`}
            >
              {label}
            </button>
          ))}

          {hasFilters && (
            <button onClick={clearAll} className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition hover:text-white">
              Clear all ✕
            </button>
          )}

          <span className="ml-auto text-sm text-slate-500">{filtered.length} tool{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </section>

      {filtered.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-3">
          {(hasFilters ? filtered : tools.slice(0, 20)).map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </section>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-10 text-center text-sm text-slate-400">
          No tools match your current filters. Try adjusting or clearing them.
        </div>
      )}
    </div>
  );
}
