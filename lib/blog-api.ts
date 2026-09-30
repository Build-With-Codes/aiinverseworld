import { apiGet, apiGetResult } from "@/lib/api-service";
import {
  getLocalBlogCategories,
  getLocalBlogPost,
  getLocalBlogPosts,
  getLocalRelatedPosts,
} from "@/lib/local-blog-data";

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
  const result = await apiGetResult<ListResponse>(`/api/blog?limit=${limit}`, { revalidate });
  if (result.status === "unreachable") return getLocalBlogPosts(limit);
  return result.status === "ok" ? (result.data.data ?? []) : [];
}

export async function getBlogCategories(): Promise<{ name: string; count: number }[]> {
  const result = await apiGetResult<ListResponse>(`/api/blog?limit=1`);
  if (result.status === "unreachable") return getLocalBlogCategories();
  return result.status === "ok" ? (result.data.categories ?? []) : [];
}

export async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  const result = await apiGetResult<{ data?: BlogPostData | null }>(
    `/api/blog/${encodeURIComponent(slug)}`,
  );
  if (result.status === "unreachable") return getLocalBlogPost(slug);
  return result.status === "ok" ? (result.data.data ?? null) : null;
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogCardData[]> {
  const result = await apiGetResult<{ data?: BlogCardData[] }>(
    `/api/blog/${encodeURIComponent(slug)}/related?limit=${limit}`,
  );
  if (result.status === "unreachable") return getLocalRelatedPosts(slug, limit);
  return result.status === "ok" ? (result.data.data ?? []) : [];
}
