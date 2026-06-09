import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildUrl, buildCategoryMeta } from "@/lib/seo";
import { getCategoryBySlug, getToolsByCategory } from "@/lib/site-data";
import { CategoryPageClient } from "./client";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  const { title, description, url } = buildCategoryMeta(
    category?.name ?? "Category",
    slug,
    category?.description ?? "Explore AI tools grouped by category on AiverseWorld.",
  );

  return {
    title,
    description,
    alternates: category ? { canonical: url } : undefined,
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) notFound();

  const categoryTools = getToolsByCategory(slug);

  return <CategoryPageClient category={category} tools={categoryTools} />;
}
