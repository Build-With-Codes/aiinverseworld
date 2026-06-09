"use client";

import { useState, useMemo } from "react";
import { CategoryCard } from "@/components/category-card";
import { SectionHeading } from "@/components/section-heading";
import { categories } from "@/lib/site-data";

export default function CategoriesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return categories;
    const q = query.toLowerCase();
    const matched = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
    if (matched.length >= 15) return matched;
    const matchedSlugs = new Set(matched.map((c) => c.slug));
    const extras = categories.filter((c) => !matchedSlugs.has(c.slug)).slice(0, 15 - matched.length);
    return [...matched, ...extras];
  }, [query]);

  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Browse"
          title="All AI tool categories"
          description="Explore every category in the catalog — from assistants and coding tools to video, audio, and enterprise platforms."
        />
        <input
          aria-label="Filter categories"
          placeholder="Search categories…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#071120] px-5 py-4 text-sm text-slate-300 outline-none placeholder:text-slate-500 focus:border-cyan-300/30"
        />
        {query && (
          <p className="mt-3 text-sm text-slate-500">
            {filtered.length} categor{filtered.length !== 1 ? "ies" : "y"} found
          </p>
        )}
      </section>

      {filtered.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </section>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-10 text-center text-sm text-slate-400">
          No categories match your search.
        </div>
      )}
    </div>
  );
}
