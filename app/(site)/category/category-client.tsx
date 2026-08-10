"use client";

import { useState, useMemo } from "react";
import { CategoryCard } from "@/components/category-card";
import { SectionHeading } from "@/components/section-heading";
import { cardClass } from "@/components/ui/card";
import type { Category } from "@/lib/catalog-types";

type CategoriesClientProps = {
  categories: Category[];
};

export function CategoriesClient({ categories }: CategoriesClientProps) {
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
  }, [categories, query]);

  const totalTools = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className={`overflow-hidden ${cardClass({ padding: "none", radius: "card-lg" })}`}>
        <div className="premium-gradient h-1 w-full" aria-hidden />
        <div className="p-8">
          <SectionHeading
            level="h1"
            eyebrow="Browse"
            title="All AI tool categories"
            description="Explore every category in the catalog - from assistants and coding tools to video, audio, and enterprise platforms."
          />
          <div className="mb-6 flex flex-wrap gap-6 text-sm text-text-secondary">
            <span>
              <strong className="text-text-primary">{categories.length}</strong> categories
            </span>
            <span>
              <strong className="text-text-primary">{totalTools.toLocaleString()}</strong> tools total
            </span>
          </div>
          <input
            aria-label="Filter categories"
            placeholder="Search categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            suppressHydrationWarning
            className="platform-input px-5 py-4 text-sm"
          />
          {query && (
            <p className="text-sm mt-3 text-text-muted">
              {filtered.length} categor{filtered.length !== 1 ? "ies" : "y"} found
            </p>
          )}
        </div>
      </section>

      {filtered.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((category) => (
            <CategoryCard key={category.slug} category={category} headingLevel="h2" />
          ))}
        </section>
      ) : (
        <div className={`text-center text-sm text-text-muted ${cardClass({ padding: "lg" })}`}>
          No categories match your search.
        </div>
      )}
    </div>
  );
}
