import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildUrl } from "@/lib/seo";
import { getCategoryBySlug, getToolsByCategory } from "@/lib/site-data";
import { CategoryPageClient } from "./client";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  return {
    title: category ? `${category.name} AI Tools | AiverseWorld` : "Category | AiverseWorld",
    description: category?.description ?? "Explore AI tools grouped by category on AiverseWorld.",
    alternates: category ? { canonical: buildUrl(`/category/${category.slug}`) } : undefined,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const categoryTools = getToolsByCategory(slug);

  return <CategoryPageClient category={category} tools={categoryTools} />;
}
