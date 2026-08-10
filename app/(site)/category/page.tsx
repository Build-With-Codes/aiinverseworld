import type { Metadata } from "next";

import { getCategories } from "@/lib/tool-catalog";
import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";
import { CategoriesClient } from "./category-client";

export function generateMetadata(): Metadata {
  return buildMetadata(getRouteSeo("/category"));
}

export default async function CategoriesPage() {
  const result = await getCategories();

  return <CategoriesClient categories={result.categories} />;
}
