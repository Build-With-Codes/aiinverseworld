import { apiGet } from "@/lib/api-service";
import type { AITool, BestList, Category, Comparison } from "@/lib/catalog-types";

type ToolListResponse = {
  data?: AITool[];
  pagination?: Pagination;
  filters?: {
    categories?: string[];
  };
};

type RecommendResponse = {
  data?: Array<AITool & { recommendation?: { score: number; reason: string } }>;
};

type DataResponse<T> = {
  data?: T;
};

type DataListResponse<T> = {
  data?: T[];
};

type CategoryResponse = {
  data?: Category;
  tools?: AITool[];
  pagination?: Pagination;
};

type BestListResponse = {
  data?: BestList;
  tools?: AITool[];
  pagination?: Pagination;
};

type ComparisonResponse = {
  data?: Comparison;
  left?: AITool;
  right?: AITool;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const emptyPagination: Pagination = {
  page: 1,
  limit: 24,
  total: 0,
  totalPages: 1,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildCategories(tools: AITool[]): Category[] {
  return Array.from(
    tools.reduce((map, tool) => {
      const slug = slugify(tool.category);
      const current = map.get(slug);

      if (current) {
        current.count += 1;
      } else {
        map.set(slug, {
          name: tool.category,
          slug,
          count: 1,
          description: `${tool.category} tools curated for practical business use cases.`,
        });
      }

      return map;
    }, new Map<string, Category>()),
  ).map(([, category]) => category);
}

export async function getToolCatalog(limit = 200, revalidate?: number) {
  const payload = await apiGet<ToolListResponse>(`/api/tools?limit=${limit}`, { revalidate });
  const tools = payload?.data ?? [];

  return {
    tools,
    categories: buildCategories(tools),
    pagination: payload?.pagination ?? {
      page: 1,
      limit,
      total: tools.length,
      totalPages: 1,
    },
  };
}

export async function getToolBySlug(slug: string) {
  const payload = await apiGet<DataResponse<AITool>>(`/api/tools/slug/${slug}`);
  return payload?.data ?? null;
}

export async function getToolById(id: string) {
  const payload = await apiGet<DataResponse<AITool>>(`/api/tools/id/${id}`);
  return payload?.data ?? null;
}

export async function getCategories(revalidate?: number) {
  const payload = await apiGet<DataListResponse<Category>>("/api/tools/categories", { revalidate });

  return {
    categories: payload?.data ?? [],
  };
}

export async function getCategoryWithTools(slug: string, page = 1, limit = 24) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const payload = await apiGet<CategoryResponse>(`/api/tools/categories/${slug}?${params.toString()}`);

  if (!payload?.data) {
    return null;
  }

  return {
    category: payload.data,
    tools: payload.tools ?? [],
    pagination: payload.pagination ?? emptyPagination,
  };
}

export async function getBestLists(revalidate?: number) {
  const payload = await apiGet<DataListResponse<BestList>>("/api/tools/best", { revalidate });

  return {
    lists: payload?.data ?? [],
  };
}

export async function getBestListWithTools(slug: string, page = 1, limit = 24) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const payload = await apiGet<BestListResponse>(`/api/tools/best/${slug}?${params.toString()}`);

  if (!payload?.data) {
    return null;
  }

  return {
    list: payload.data,
    tools: payload.tools ?? [],
    pagination: payload.pagination ?? emptyPagination,
  };
}

export async function getComparisons(limit = 120, revalidate?: number) {
  const payload = await apiGet<DataListResponse<Comparison>>(`/api/tools/comparisons?limit=${limit}`, {
    revalidate,
  });

  return {
    comparisons: payload?.data ?? [],
  };
}

export async function getComparisonWithTools(slug: string) {
  const payload = await apiGet<ComparisonResponse>(`/api/tools/comparisons/${slug}`);

  if (!payload?.left || !payload.right) {
    return null;
  }

  return {
    comparison: payload.data,
    left: payload.left,
    right: payload.right,
  };
}

export async function getComparisonByIds(leftId: string, rightId: string) {
  const params = new URLSearchParams({ leftId, rightId });
  const payload = await apiGet<ComparisonResponse>(`/api/tools/compare?${params.toString()}`);

  if (!payload?.left || !payload.right) {
    return null;
  }

  return {
    comparison: payload.data,
    left: payload.left,
    right: payload.right,
  };
}

export async function getToolOptions() {
  const catalog = await getToolCatalog();

  return catalog.tools.map((tool) => ({
    value: tool.id,
    slug: tool.slug,
    label: tool.name,
  }));
}

export async function searchTools(options: {
  query?: string;
  category?: string;
  pricing?: string;
  platform?: string;
  freeOnly?: boolean;
  apiOnly?: boolean;
  openSourceOnly?: boolean;
  limit?: number;
  page?: number;
}) {
  const params = new URLSearchParams({
    page: String(options.page ?? 1),
    limit: String(options.limit ?? 100),
    sort: options.query ? "popular" : "rank",
  });

  if (options.query) params.set("q", options.query);
  if (options.category) params.set("category", options.category);
  if (options.pricing) params.set("pricing", options.pricing);
  if (options.platform) params.set("platform", options.platform);
  if (options.freeOnly) params.set("freeOnly", "true");
  if (options.apiOnly) params.set("apiOnly", "true");
  if (options.openSourceOnly) params.set("openSourceOnly", "true");

  const payload = await apiGet<ToolListResponse>(`/api/tools?${params.toString()}`);
  const tools = payload?.data ?? [];
  const categoryResult = await getCategories();

  return {
    tools,
    categories: categoryResult.categories,
    pagination: payload?.pagination ?? emptyPagination,
  };
}

/** Most recently verified tools — used for "New" badges in the mega menu. */
export async function getNewestTools(limit = 6, revalidate?: number) {
  const payload = await apiGet<ToolListResponse>(`/api/tools?limit=${limit}&sort=newest`, {
    revalidate,
  });
  return payload?.data ?? [];
}

export async function recommendTools(query: string, limit = 8, revalidate?: number) {
  if (!query.trim()) {
    const catalog = await getToolCatalog(limit, revalidate);
    return catalog.tools.slice(0, limit);
  }

  const params = new URLSearchParams({ q: query, limit: String(limit) });
  const payload = await apiGet<RecommendResponse>(`/api/tools/recommend?${params.toString()}`, {
    revalidate,
  });

  return payload?.data ?? [];
}
