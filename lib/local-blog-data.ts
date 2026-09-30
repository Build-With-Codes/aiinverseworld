import fs from "node:fs";
import path from "node:path";

import type { BlogCardData, BlogPostData, MediaRef } from "@/lib/blog-api";
import { buildHeaderIndex, parseCsv } from "@/lib/csv-parser";

// ── Offline fallback blog catalog ─────────────────────────────────────────
// Same pattern as lib/local-tools-data.ts: used only when the backend is
// unreachable, sourced from data/BlogPost_rows.csv (a direct table export),
// so it only ever serves real, already-published posts, never invented ones.

const CSV_PATH = path.join(process.cwd(), "data", "BlogPost_rows.csv");
const MEDIA_CSV_PATH = path.join(process.cwd(), "data", "Media_rows.csv");

type MediaRecord = { url: string; width?: number; height?: number; blurDataUrl?: string };

let mediaCache: Map<string, MediaRecord> | null | undefined;

function loadMediaMap(): Map<string, MediaRecord> {
  if (mediaCache !== undefined) return mediaCache ?? new Map();

  try {
    const text = fs.readFileSync(MEDIA_CSV_PATH, "utf8");
    const rows = parseCsv(text);
    if (rows.length < 2) {
      mediaCache = null;
      return new Map();
    }

    const headerIndex = buildHeaderIndex(rows[0]);
    const map = new Map<string, MediaRecord>();
    for (const row of rows.slice(1)) {
      if (row.every((cell) => cell.trim() === "")) continue;
      const get = (name: string) => (row[headerIndex.get(name) ?? -1] ?? "").trim();
      const id = get("id");
      if (!id) continue;
      map.set(id, {
        url: get("url"),
        width: Number(get("width")) || undefined,
        height: Number(get("height")) || undefined,
        blurDataUrl: get("blurDataUrl") || undefined,
      });
    }
    mediaCache = map;
  } catch (error) {
    console.warn(
      `[local-blog-data] could not read ${MEDIA_CSV_PATH}: ${error instanceof Error ? error.message : "unknown error"}`,
    );
    mediaCache = null;
  }

  return mediaCache ?? new Map();
}

function toIsoDate(value: string): string {
  if (!value) return value;
  const parsed = new Date(value.includes(" ") ? value.replace(" ", "T") : value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

function toTagArray(value: string): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

function mapRowToPost(headerIndex: Map<string, number>, row: string[]): BlogPostData {
  const get = (name: string) => (row[headerIndex.get(name) ?? -1] ?? "").trim();

  const title = get("title");
  const description = get("description");
  const publishedAt = toIsoDate(get("publishedAt"));

  // The site's CSP only allows https/data/blob image sources — an
  // http:// URL (a handful of these rows still point at a local dev
  // upload path) would be blocked by the browser on every single load,
  // everywhere, not just here. Treating it as absent up front avoids a
  // guaranteed-failing request and lets the real placeholder show
  // immediately instead of after a failed load.
  const isUsableImageUrl = (url: string) => url.startsWith("https://") || url.startsWith("/");
  const media = loadMediaMap().get(get("coverMediaId"));
  const rawCoverImage = get("coverImage") || media?.url || "";
  const coverImage = isUsableImageUrl(rawCoverImage) ? rawCoverImage : undefined;
  const cover: MediaRef | undefined = coverImage
    ? {
        url: coverImage,
        alt: `${title} cover image`,
        width: media?.width,
        height: media?.height,
        blurDataUrl: media?.blurDataUrl,
      }
    : undefined;

  return {
    slug: get("slug"),
    title,
    description,
    category: get("category"),
    tags: toTagArray(get("tags")),
    author: get("author") || "AiverseWorld Team",
    coverImage,
    cover,
    readTime: get("readTime") || "5 min",
    featured: get("featured").toLowerCase() === "true",
    publishedAt,
    updatedAt: toIsoDate(get("updatedAt")) || publishedAt,
    content: get("content"),
    seoTitle: get("seoTitle") || undefined,
    metaDescription: get("metaDescription") || undefined,
  };
}

let cache: BlogPostData[] | null | undefined;

function loadLocalPosts(): BlogPostData[] {
  if (cache !== undefined) return cache ?? [];

  try {
    const text = fs.readFileSync(CSV_PATH, "utf8");
    const rows = parseCsv(text);
    if (rows.length < 2) {
      cache = null;
      return [];
    }

    const headerIndex = buildHeaderIndex(rows[0]);
    const publishedIdx = headerIndex.get("published") ?? -1;

    const posts = rows
      .slice(1)
      .filter((row) => !row.every((cell) => cell.trim() === ""))
      .filter((row) => (row[publishedIdx] ?? "").trim().toLowerCase() === "true")
      .map((row) => mapRowToPost(headerIndex, row))
      .filter((post) => Boolean(post.slug && post.title));

    cache = posts;
  } catch (error) {
    console.warn(
      `[local-blog-data] could not read ${CSV_PATH}: ${error instanceof Error ? error.message : "unknown error"}`,
    );
    cache = null;
  }

  return cache ?? [];
}

export function getLocalBlogPosts(limit = 48): BlogCardData[] {
  return [...loadLocalPosts()]
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""))
    .slice(0, limit)
    .map(({ content: _content, blocks: _blocks, seoTitle: _seoTitle, metaDescription: _metaDescription, ...card }) => card);
}

export function getLocalBlogCategories(): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of loadLocalPosts()) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

export function getLocalBlogPost(slug: string): BlogPostData | null {
  return loadLocalPosts().find((post) => post.slug === slug) ?? null;
}

export function getLocalRelatedPosts(slug: string, limit = 3): BlogCardData[] {
  const post = getLocalBlogPost(slug);
  const posts = loadLocalPosts().filter((p) => p.slug !== slug);
  const related = post
    ? [...posts].sort((a, b) => (a.category === post.category ? -1 : 0) - (b.category === post.category ? -1 : 0))
    : posts;

  return related
    .slice(0, limit)
    .map(({ content: _content, blocks: _blocks, seoTitle: _seoTitle, metaDescription: _metaDescription, ...card }) => card);
}
