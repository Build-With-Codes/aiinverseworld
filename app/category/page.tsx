import { getCategories } from "@/lib/tool-catalog";
import { CategoriesClient } from "./category-client";

export default async function CategoriesPage() {
  const result = await getCategories();

  return <CategoriesClient categories={result.categories} />;
}
