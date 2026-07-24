import { apiGet } from "@/lib/api-service";

export type MediaRef = {
  id?: string;
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
  license?: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
};

export type BlogCardData = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  cover?: MediaRef;
  coverImage?: string;
  gallery?: MediaRef[];
  readTime: string;
  featured: boolean;
  publishedAt: string;
  updatedAt?: string;
};

export type Block =
  | { type: "heading"; level: 2 | 3 | 4; html: string; id?: string }
  | { type: "paragraph"; html: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; html: string }
  | { type: "code"; code: string; lang?: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "image"; src: string; alt?: string; caption?: string; width?: number; height?: number }
  | { type: "divider" };

export type BlogPostData = BlogCardData & {
  content: string;
  blocks?: Block[];
  seoTitle?: string;
  metaDescription?: string;
};

type ListResponse = {
  data?: BlogCardData[];
  categories?: { name: string; count: number }[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
};

export async function getAllBlogPosts(limit = 48, revalidate?: number): Promise<BlogCardData[]> {
  const payload = await apiGet<ListResponse>(`/api/blog?limit=${limit}`, { revalidate });
  return payload?.data ?? [];
}

export async function getBlogCategories(): Promise<{ name: string; count: number }[]> {
  const payload = await apiGet<ListResponse>(`/api/blog?limit=1`);
  return payload?.categories ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  const payload = await apiGet<{ data?: BlogPostData | null }>(
    `/api/blog/${encodeURIComponent(slug)}`,
  );
  return payload?.data ?? null;
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogCardData[]> {
  const payload = await apiGet<{ data?: BlogCardData[] }>(
    `/api/blog/${encodeURIComponent(slug)}/related?limit=${limit}`,
  );
  return payload?.data ?? [];
}
