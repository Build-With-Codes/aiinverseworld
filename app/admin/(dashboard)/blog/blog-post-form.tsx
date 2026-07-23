"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { cardClass } from "@/components/ui/card";
import {
  saveBlogPost,
  uploadCoverImage,
  type AdminBlogFormValues,
} from "@/lib/admin-blog-client";

const inputClass =
  "w-full rounded-sm border border-border-subtle bg-surface-1 px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-border-accent";
const labelClass = "text-sm font-medium text-text-secondary";

export type InitialBlogValues = AdminBlogFormValues & { coverPreviewUrl?: string };

export function BlogPostForm({ initial }: { initial?: InitialBlogValues }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(initial?.slug);

  const [values, setValues] = useState<AdminBlogFormValues>(
    initial ?? {
      slug: "",
      title: "",
      description: "",
      content: "",
      category: "",
      tags: "",
      author: "AiverseWorld Team",
      readTime: "5 min",
      coverImage: "",
      coverMediaId: null,
      seoTitle: "",
      metaDescription: "",
      featured: false,
      published: true,
    },
  );
  const [coverPreview, setCoverPreview] = useState(initial?.coverPreviewUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof AdminBlogFormValues>(key: K, value: AdminBlogFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const media = await uploadCoverImage(file);
      update("coverMediaId", media.id);
      setCoverPreview(media.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saveBlogPost(values);
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <div>
          <label className={labelClass} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            required
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </div>

        {isEditing ? (
          <div>
            <label className={labelClass} htmlFor="slug">
              Slug
            </label>
            <input id="slug" disabled value={values.slug} className={`${inputClass} mt-1.5 opacity-60`} />
          </div>
        ) : null}

        <div>
          <label className={labelClass} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={2}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="category">
              Category
            </label>
            <input
              id="category"
              required
              value={values.category}
              onChange={(e) => update("category", e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              value={values.tags}
              onChange={(e) => update("tags", e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="author">
              Author
            </label>
            <input
              id="author"
              value={values.author}
              onChange={(e) => update("author", e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="readTime">
              Read time
            </label>
            <input
              id="readTime"
              value={values.readTime}
              onChange={(e) => update("readTime", e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </div>
        </div>
      </div>

      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <p className="text-eyebrow text-brand-cyan-strong">Cover image</p>
        {coverPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverPreview} alt="Cover preview" className="h-40 w-full rounded-card object-cover" />
        ) : null}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          disabled={uploading}
          className="text-sm text-text-secondary file:mr-3 file:cursor-pointer file:rounded-pill file:border-0 file:bg-surface-3 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-text-primary"
        />
        {uploading ? <p className="text-sm text-text-muted">Uploading…</p> : null}
        <div>
          <label className={labelClass} htmlFor="coverImage">
            Or paste an image URL
          </label>
          <input
            id="coverImage"
            value={values.coverImage}
            onChange={(e) => update("coverImage", e.target.value)}
            placeholder="https://…"
            className={`${inputClass} mt-1.5`}
          />
        </div>
      </div>

      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <label className={labelClass} htmlFor="content">
          Content (HTML)
        </label>
        <textarea
          id="content"
          required
          rows={16}
          value={values.content}
          onChange={(e) => update("content", e.target.value)}
          className={`${inputClass} font-mono text-xs`}
          placeholder="<p>Write the post body as HTML — headings, paragraphs, lists, tables, and images all render on the site.</p>"
        />
      </div>

      <div className={`space-y-4 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <p className="text-eyebrow text-brand-cyan-strong">SEO</p>
        <div>
          <label className={labelClass} htmlFor="seoTitle">
            SEO title
          </label>
          <input
            id="seoTitle"
            value={values.seoTitle}
            onChange={(e) => update("seoTitle", e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="metaDescription">
            Meta description
          </label>
          <textarea
            id="metaDescription"
            rows={2}
            value={values.metaDescription}
            onChange={(e) => update("metaDescription", e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </div>
      </div>

      <div className={`flex flex-wrap items-center gap-6 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => update("published", e.target.checked)}
          />
          Published
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Featured
        </label>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="cursor-pointer rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-5 py-2.5 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : isEditing ? "Save changes" : "Create post"}
        </button>
      </div>
    </form>
  );
}
