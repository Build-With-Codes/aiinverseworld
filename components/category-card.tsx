import Link from "next/link";

import { cardClass } from "@/components/ui/card";
import { CategoryIcon, getCategoryTone } from "@/lib/category-visuals";
import type { Category } from "@/lib/catalog-types";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const tone = getCategoryTone(category.slug);

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
      <h3 className="text-heading-1 mt-5 text-text-primary">{category.name}</h3>
      <p className="text-body mt-2 text-text-secondary">{category.description}</p>
      <span className={`text-caption mt-4 inline-block font-semibold ${tone.text}`}>
        {category.count} listed tools
      </span>
    </Link>
  );
}
