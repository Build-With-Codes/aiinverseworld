import fs from "node:fs";
import path from "node:path";

import type { AITool, Category } from "@/lib/catalog-types";
import { buildHeaderIndex, parseCsv } from "@/lib/csv-parser";
import type { Pagination } from "@/lib/tool-catalog";

// ── Offline fallback catalog ──────────────────────────────────────────────
// Used only when the backend is unreachable (network error / timeout / 5xx —
// never for a legitimate 4xx from a reachable backend, which means "this
// specific thing doesn't exist" and must not be papered over with stale local
// data). Source is data/ai_tools_directory.csv, the same file the admin CSV
// importer reads — so this never fabricates tools, it only serves a slightly
// stale snapshot of real ones when the live API can't answer.

const CSV_PATH = path.join(process.cwd(), "data", "ai_tools_directory.csv");

const categoryDescriptions: Record<string, string> = {
  "ai-assistant": "General-purpose assistants for writing, coding, reasoning, and productivity.",
  "ai-search": "Search-oriented AI tools focused on research and cited answers.",
};

function toPipeArray(value: string): string[] {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toBoolField(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === "true" || v === "yes" || v === "1";
}

function toFreePlanField(value: string): "Yes" | "No" | "Limited" {
  const v = value.trim().toLowerCase();
  if (v === "true" || v === "yes" || v === "1") return "Yes";
  if (v === "limited") return "Limited";
  return "No";
}

function toNumberField(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toFaqArray(value: string): { question: string; answer: string }[] {
  return value
    .split("|")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [question, ...rest] = pair.split("::");
      return { question: (question ?? "").trim(), answer: rest.join("::").trim() };
    })
    .filter((item) => Boolean(item.question && item.answer));
}

function toFeatureNoteArray(value: string): { feature: string; benefit: string }[] {
  return value
    .split("|")
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [feature, ...rest] = pair.split("::");
      return { feature: (feature ?? "").trim(), benefit: rest.join("::").trim() };
    })
    .filter((item) => Boolean(item.feature && item.benefit));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapRowToTool(headerIndex: Map<string, number>, row: string[], index: number): AITool {
  const get = (name: string) => (row[headerIndex.get(name) ?? -1] ?? "").trim();

  const name = get("name");
  const slug = get("slug") || slugify(name);
  const status = get("status");
  const domain = get("domain");
  // A handful of catalog rows ship without a direct favicon URL — the same
  // rows the real catalog already handles this way (e.g. Grok, Gemini,
  // DeepSeek) use Google's favicon service as the source instead, so blank
  // rows here get the same real, working fallback rather than an empty src
  // (which next/image rejects outright).
  const favicon = get("favicon") || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : "");

  return {
    // Prefixed and clearly distinct from real Prisma cuids, so a stale local
    // id is never mistaken for (or accidentally matches) a live backend id.
    id: `local-${slug}`,
    rank: toNumberField(get("rank")) ?? index + 1,
    name,
    slug,
    category: get("category"),
    subcategory: get("subcategory"),
    company: get("company"),
    website: get("website"),
    domain,
    favicon,
    logoUrl: get("logoUrl") || undefined,
    freePlan: toFreePlanField(get("freePlan")),
    freeTrial: toBoolField(get("freeTrial")),
    pricingModel: (get("pricingModel") || "Custom") as AITool["pricingModel"],
    startingPriceUsd: toNumberField(get("startingPriceUsd")),
    pricingNotes: get("pricingNotes") || undefined,
    shortDescription: get("shortDescription"),
    summary: get("summary") || undefined,
    features: toPipeArray(get("features")),
    bestFor: toPipeArray(get("bestFor")),
    targetAudience: toPipeArray(get("targetAudience")),
    tags: toPipeArray(get("tags")),
    aiType: toPipeArray(get("aiType")),
    modalities: toPipeArray(get("modalities")),
    modelProvider: toPipeArray(get("modelProvider")),
    modelNames: toPipeArray(get("modelNames")),
    apiAvailable: toBoolField(get("apiAvailable")),
    openSource: toBoolField(get("openSource")),
    deploymentType: toPipeArray(get("deploymentType")),
    platforms: toPipeArray(get("platforms")),
    integrations: toPipeArray(get("integrations")),
    teamCollaboration: get("teamCollaboration") ? toBoolField(get("teamCollaboration")) : undefined,
    security: toPipeArray(get("security")),
    privacyNotes: get("privacyNotes") || undefined,
    popularityScore: toNumberField(get("popularityScore")) ?? undefined,
    rating: toNumberField(get("rating")) ?? undefined,
    reviewCount: toNumberField(get("reviewCount")) ?? undefined,
    status: (status || "Active") as AITool["status"],
    launchYear: toNumberField(get("launchYear")) ?? undefined,
    lastVerified: get("lastVerified"),
    sourceUrl: get("sourceUrl") || get("website"),
    sourceType: (get("sourceType") || "Directory") as AITool["sourceType"],
    pros: toPipeArray(get("pros")),
    cons: toPipeArray(get("cons")),
    editorialVerdict: get("editorialVerdict") || undefined,
    alternativesNote: get("alternativesNote") || undefined,
    faqs: toFaqArray(get("faqs")),
    featureNotes: toFeatureNoteArray(get("featureNotes")),
  };
}

/** Every field this filters/sorts on, concatenated and lowercased — mirrors the
 * backend's `searchText` column closely enough for a degraded-mode match. */
function buildSearchBlob(tool: AITool): string {
  return [
    tool.name,
    tool.company,
    tool.category,
    tool.subcategory,
    tool.shortDescription,
    tool.summary,
    ...tool.tags,
    ...tool.platforms,
    ...tool.bestFor,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

let cache: { tools: AITool[]; blobs: Map<string, string> } | null | undefined;

function loadLocalCatalog() {
  if (cache !== undefined) return cache;

  try {
    const text = fs.readFileSync(CSV_PATH, "utf8");
    const rows = parseCsv(text);
    if (rows.length < 2) {
      cache = null;
      return cache;
    }

    const headerIndex = buildHeaderIndex(rows[0]);
    const tools = rows
      .slice(1)
      .filter((row) => !row.every((cell) => cell.trim() === ""))
      .map((row, idx) => mapRowToTool(headerIndex, row, idx));

    const blobs = new Map(tools.map((tool) => [tool.id, buildSearchBlob(tool)]));
    cache = { tools, blobs };
  } catch (error) {
    console.warn(
      `[local-tools-data] could not read ${CSV_PATH}: ${error instanceof Error ? error.message : "unknown error"}`,
    );
    cache = null;
  }

  return cache;
}

export function getLocalTools(): AITool[] {
  return loadLocalCatalog()?.tools ?? [];
}

export function getLocalToolBySlug(slug: string): AITool | null {
  return getLocalTools().find((tool) => tool.slug === slug) ?? null;
}

export function getLocalToolById(id: string): AITool | null {
  return getLocalTools().find((tool) => tool.id === id) ?? null;
}

export function getLocalCategories(): Category[] {
  const counts = new Map<string, { name: string; count: number }>();

  for (const tool of getLocalTools()) {
    const slug = slugify(tool.category);
    const existing = counts.get(slug);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(slug, { name: tool.category, count: 1 });
    }
  }

  return Array.from(counts.entries())
    .map(([slug, { name, count }]) => ({
      name,
      slug,
      count,
      description: categoryDescriptions[slug] || `${name} tools curated for practical business use cases.`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export type LocalToolQuery = {
  page?: number;
  limit?: number;
  category?: string;
  pricing?: string;
  platform?: string;
  freeOnly?: boolean;
  apiOnly?: boolean;
  openSourceOnly?: boolean;
  search?: string;
  sort?: "rank" | "popular" | "rating" | "newest";
};

function compareBy(sort: LocalToolQuery["sort"]) {
  return (a: AITool, b: AITool) => {
    if (sort === "popular") {
      return (b.popularityScore ?? 0) - (a.popularityScore ?? 0) || a.rank - b.rank;
    }
    if (sort === "rating") {
      return (
        (b.rating ?? 0) - (a.rating ?? 0) ||
        (b.reviewCount ?? 0) - (a.reviewCount ?? 0) ||
        a.rank - b.rank
      );
    }
    if (sort === "newest") {
      return (b.lastVerified || "").localeCompare(a.lastVerified || "") || a.rank - b.rank;
    }
    return a.rank - b.rank || (b.popularityScore ?? 0) - (a.popularityScore ?? 0);
  };
}

export function queryLocalTools(query: LocalToolQuery): { data: AITool[]; pagination: Pagination; filters: { categories: string[] } } {
  const { blobs } = loadLocalCatalog() ?? { blobs: new Map<string, string>() };
  let tools = getLocalTools();
  const allCategories = Array.from(new Set(tools.map((tool) => tool.category))).sort();

  if (query.category) {
    const category = query.category.toLowerCase();
    tools = tools.filter((tool) => tool.category.toLowerCase() === category);
  }
  if (query.pricing) {
    const pricing = query.pricing.toLowerCase();
    tools = tools.filter((tool) => tool.pricingModel.toLowerCase() === pricing);
  }
  if (query.platform) {
    const platform = query.platform.toLowerCase();
    tools = tools.filter((tool) => (blobs.get(tool.id) ?? "").includes(platform));
  }
  if (query.freeOnly) {
    tools = tools.filter((tool) => tool.freePlan === "Yes");
  }
  if (query.apiOnly) {
    tools = tools.filter((tool) => tool.apiAvailable);
  }
  if (query.openSourceOnly) {
    tools = tools.filter((tool) => tool.openSource);
  }
  if (query.search) {
    const search = query.search.toLowerCase();
    tools = tools.filter((tool) => (blobs.get(tool.id) ?? "").includes(search));
  }

  tools = [...tools].sort(compareBy(query.sort));

  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 24));
  const total = tools.length;
  const start = (page - 1) * limit;
  const data = tools.slice(start, start + limit);

  return {
    data,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    filters: { categories: allCategories },
  };
}

export function getLocalCategoryWithTools(
  slug: string,
  page = 1,
  limit = 24,
): { category: Category; tools: AITool[]; pagination: Pagination } | null {
  const category = getLocalCategories().find((c) => c.slug === slug);
  if (!category) return null;

  const result = queryLocalTools({ category: category.name, page, limit, sort: "rank" });
  return { category, tools: result.data, pagination: result.pagination };
}

type ComparisonSide = { slug: string; name: string; favicon: string; category: string };
type LocalComparison = { slug: string; title: string; summary: string; left: ComparisonSide; right: ComparisonSide };

function toComparisonSide(tool: AITool): ComparisonSide {
  return { slug: tool.slug, name: tool.name, favicon: tool.favicon, category: tool.category };
}

function comparisonSummary(left: AITool, right: AITool): string {
  return `Compare ${left.name} and ${right.name} across pricing, features, platforms, and use cases.`;
}

/** Same algorithm as the backend's getComparisons: popularity-ranked, same-category
 * pairs first, deduplicated, filled out with adjacent-popularity cross-category
 * pairs — not curated, so replicating it locally isn't fabricating anything. */
export function queryLocalComparisons(limit = 120): LocalComparison[] {
  const take = Math.min(200, Math.max(2, limit));
  const tools = [...getLocalTools()].sort(compareBy("popular")).slice(0, take);

  const byCategory = new Map<string, AITool[]>();
  for (const tool of tools) {
    const bucket = byCategory.get(tool.category);
    if (bucket) bucket.push(tool);
    else byCategory.set(tool.category, [tool]);
  }

  const seen = new Set<string>();
  const pairs: LocalComparison[] = [];

  function addPair(left: AITool, right: AITool) {
    if (pairs.length >= take || left.slug === right.slug) return;
    const key = [left.slug, right.slug].sort().join("|");
    if (seen.has(key)) return;
    seen.add(key);
    pairs.push({
      slug: `${left.slug}-vs-${right.slug}`,
      title: `${left.name} vs ${right.name}`,
      summary: comparisonSummary(left, right),
      left: toComparisonSide(left),
      right: toComparisonSide(right),
    });
  }

  for (const bucket of byCategory.values()) {
    for (let i = 0; i < bucket.length && pairs.length < take; i += 1) {
      for (let offset = 1; offset <= 2 && i + offset < bucket.length && pairs.length < take; offset += 1) {
        addPair(bucket[i], bucket[i + offset]);
      }
    }
  }

  for (let index = 0; index < tools.length - 1 && pairs.length < take; index += 1) {
    addPair(tools[index], tools[index + 1]);
  }

  return pairs;
}

/** Mirrors the backend's getComparison(slug): parses "left-slug-vs-right-slug". */
export function getLocalComparisonBySlug(
  slug: string,
): { comparison: { slug: string; title: string; summary: string }; left: AITool; right: AITool } | null {
  const vsIndex = slug.indexOf("-vs-");
  if (vsIndex < 1) return null;

  const left = getLocalToolBySlug(slug.slice(0, vsIndex));
  const right = getLocalToolBySlug(slug.slice(vsIndex + 4));
  if (!left || !right) return null;

  return {
    comparison: { slug, title: `${left.name} vs ${right.name}`, summary: comparisonSummary(left, right) },
    left,
    right,
  };
}
