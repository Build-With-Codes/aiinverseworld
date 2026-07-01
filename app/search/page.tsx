import { searchTools } from "@/lib/tool-catalog";
import { SearchClient } from "./search-client";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, Number(pageParam) || 1);
  const result = await searchTools({ query, page, limit: 24 });

  return (
    <SearchClient
      initialTools={result.tools}
      categories={result.categories}
      initialQuery={query}
      pagination={result.pagination}
    />
  );
}
