import { notFound } from "next/navigation";
import type { Metadata } from "next";


import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { backendAdminFetch, getAdminKeyFromCookies } from "@/lib/admin-proxy";

import { BlogPostForm, type InitialBlogValues } from "../../blog-post-form";

export const metadata: Metadata = buildNoIndexMetadata("Edit blog post | AiverseWorld Admin");

export const dynamic = "force-dynamic";

type FullPost = {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  cover?: { id: string; url: string };
  coverImage?: string;
  seoTitle?: string;
  metaDescription?: string;
  featured: boolean;
  published: boolean;
};

async function getPost(slug: string): Promise<FullPost | null> {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return null;

  const res = await backendAdminFetch(`blog/${encodeURIComponent(slug)}`, { adminKey });
  if (!res.ok) return null;
  const payload = (await res.json()) as { data: FullPost | null };
  return payload.data;
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const initial: InitialBlogValues = {
    slug: post.slug,
    title: post.title,
    description: post.description,
    content: post.content,
    category: post.category,
    tags: post.tags.join(", "),
    author: post.author,
    readTime: post.readTime,
    coverImage: post.coverImage ?? "",
    coverMediaId: post.cover?.id ?? null,
    coverPreviewUrl: post.cover?.url ?? post.coverImage,
    seoTitle: post.seoTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    featured: post.featured,
    published: post.published,
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-heading-1 text-text-primary">Edit post</h1>
      <BlogPostForm initial={initial} />
    </div>
  );
}
