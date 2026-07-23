export type AdminBlogFormValues = {
  slug?: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  readTime: string;
  coverImage: string;
  coverMediaId: string | null;
  seoTitle: string;
  metaDescription: string;
  featured: boolean;
  published: boolean;
};

export async function saveBlogPost(values: AdminBlogFormValues) {
  const res = await fetch("/api/admin/blog", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      slug: values.slug || undefined,
      title: values.title,
      description: values.description,
      content: values.content,
      category: values.category,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author: values.author || undefined,
      readTime: values.readTime || undefined,
      coverImage: values.coverImage || null,
      coverMediaId: values.coverMediaId,
      seoTitle: values.seoTitle || null,
      metaDescription: values.metaDescription || null,
      featured: values.featured,
      published: values.published,
    }),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) throw new Error(payload?.error ?? payload?.message ?? "Failed to save post.");
  return payload;
}

export async function deleteBlogPost(slug: string) {
  const res = await fetch(`/api/admin/blog/${encodeURIComponent(slug)}`, { method: "DELETE" });
  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    throw new Error(payload?.error ?? payload?.message ?? "Failed to delete post.");
  }
}

export async function uploadCoverImage(file: File): Promise<{ id: string; url: string }> {
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });

  const res = await fetch("/api/admin/media/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, filename: file.name }),
  });
  const payload = await res.json().catch(() => null);
  if (!res.ok) throw new Error(payload?.error ?? payload?.message ?? "Upload failed.");
  return payload.data;
}
