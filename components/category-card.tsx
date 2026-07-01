import Link from "next/link";

import type { Category } from "@/lib/catalog-types";

type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="rounded-[26px] border border-white/10 bg-linear-to-br from-white/8 to-white/3 p-6 transition hover:border-cyan-300/30 hover:bg-white/8"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
        {category.name.slice(0, 2)}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{category.name}</h3>
      <p className="mb-5 text-sm leading-6 text-slate-300">
        {category.description}
      </p>
      <span className="text-sm text-cyan-200">{category.count} listed tools</span>
    </Link>
  );
}
