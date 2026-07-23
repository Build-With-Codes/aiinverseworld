import Link from "next/link";

import { cardClass } from "@/components/ui/card";
import type { Category } from "@/lib/catalog-types";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className={cardClass({ hover: true })}>
      <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gradient-to-br from-brand-electric/20 to-brand-violet/20 text-sm font-semibold text-brand-cyan-strong">
        {category.name.slice(0, 2)}
      </div>
      <h3 className="text-heading-1 mt-5 text-text-primary">{category.name}</h3>
      <p className="text-body mt-2 text-text-secondary">{category.description}</p>
      <span className="text-caption mt-4 inline-block text-brand-cyan-strong">
        {category.count} listed tools
      </span>
    </Link>
  );
}
