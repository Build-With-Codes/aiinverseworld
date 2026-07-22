import type { Metadata } from "next";

import { buildCategoryMeta, defaultOpenGraphImage } from "@/lib/seo";
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
    openGraph: { title, description, url, type: "website", images: [defaultOpenGraphImage] },
    twitter: { card: "summary_large_image", title, description, images: [defaultOpenGraphImage.url] },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = (await searchParams) ?? {};
  const page = Math.max(1, Number(pageParam) || 1);
  const result = await getCategoryWithTools(slug, page, 24);

  return (
    <CategoryPageClient
      category={
        result?.category ?? {
          name: slug
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" "),
          slug,
          count: 0,
          description: "No data is available for this category right now.",
        }
      }
      tools={result?.tools ?? []}
      pagination={
        result?.pagination ?? {
          page,
          limit: 24,
          total: 0,
          totalPages: 1,
        }
      }
    />
  );
}
