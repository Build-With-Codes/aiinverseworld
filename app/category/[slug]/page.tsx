import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildCategoryMeta } from "@/lib/seo";
import { getCategoryWithTools } from "@/lib/tool-catalog";
import { CategoryPageClient } from "./client";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryWithTools(slug);
  const category = result?.category;

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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = (await searchParams) ?? {};
  const page = Math.max(1, Number(pageParam) || 1);
  const result = await getCategoryWithTools(slug, page, 24);

  if (!result) notFound();

  return (
    <CategoryPageClient
      category={result.category}
      tools={result.tools}
      pagination={result.pagination}
    />
  );
}
