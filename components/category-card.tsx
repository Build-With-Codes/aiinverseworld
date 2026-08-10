import Link from "next/link";

import { cardClass } from "@/components/ui/card";
import { CategoryIcon, getCategoryTone } from "@/lib/category-visuals";
import type { Category } from "@/lib/catalog-types";

type CategoryCardProps = {
  category: Category;
  /** Heading level for the card title. Defaults to "h3" (section heading -> card title).
   * Pass "h2" when the card grid has no h2 section heading above it (e.g. directly under an h1). */
  headingLevel?: "h2" | "h3";
};

export function CategoryCard({ category, headingLevel = "h3" }: CategoryCardProps) {
  const tone = getCategoryTone(category.slug);
  const Heading = headingLevel;

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`group ${cardClass({ hover: true })} ${tone.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${tone.badge} ${tone.icon}`}>
          <CategoryIcon name={category.name} />
        </div>
        <span
          aria-hidden
          className="mt-2 text-text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
        >
          →
        </span>
      </div>
      <Heading className="text-heading-1 mt-5 text-text-primary">{category.name}</Heading>
      <p className="text-body mt-2 text-text-secondary">{category.description}</p>
      <span className={`text-caption mt-4 inline-block font-semibold ${tone.text}`}>
        {category.count} listed tools
      </span>
    </Link>
  );
}
