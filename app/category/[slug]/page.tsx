import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { getCategoryBySlug, getToolsByCategory } from "@/lib/site-data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  return {
    title: category
      ? `${category.name} AI Tools | AiverseWorld`
      : "Category | AiverseWorld",
    description:
      category?.description ?? "Explore AI tools grouped by category on AiverseWorld.",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryTools = getToolsByCategory(slug);

  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Category"
          title={`${category.name} AI tools`}
          description={category.description}
        />
        <div className="grid gap-4 lg:grid-cols-4">
          {[
            "Pricing: All",
            "Rating: 4.5+",
            "Platform: Web & API",
            "Sort: Most Reviewed",
          ].map((filter) => (
            <div
              key={filter}
              className="rounded-2xl border border-white/10 bg-[#081222] px-4 py-3 text-sm text-slate-200"
            >
              {filter}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </section>
    </div>
  );
}
