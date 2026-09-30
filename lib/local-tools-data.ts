import fs from "node:fs";
import path from "node:path";

import type { AITool, Category, Spotlight } from "@/lib/catalog-types";
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

// ── Local "featured" / "trending" (real rank, generic framing) ───────────
// Real editorial picks and real analytics-derived trending can't be
// reconstructed locally — there's no curation record or save/search counts
// in the CSV. What follows is honestly a different thing: the highest-rated
// and highest-popularity real tools, labeled plainly rather than claiming to
// be hand-picked or analytics-driven, so it never overstates what it is.
export function getLocalSpotlights(limit = 3): Spotlight[] {
  const tools = [...getLocalTools()]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.popularityScore ?? 0) - (a.popularityScore ?? 0))
    .slice(0, Math.max(1, limit));

  return tools.map((tool) => ({
    key: tool.slug,
    emoji: "⭐",
    label: "Top rated",
    blurb: tool.shortDescription,
    tool,
  }));
}

export function getLocalTrendingTools(limit = 12): AITool[] {
  return queryLocalTools({ sort: "popular", limit }).data;
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

// ── Local "recommend" (semantic-ish keyword + ranking match) ─────────────
// Ports the backend's own non-embedding fallback algorithm verbatim (see
// ToolsService.recommend / fuzzyToolScore in the backend repo) rather than
// inventing a new one — this is exactly what the real backend itself falls
// back to when it can't produce an embedding-based match, so replicating it
// here isn't a lesser stand-in, it's the same logic running client-side.
// What this can never replicate is the LLM-generated `answer` summary — that
// stays empty, never fabricated.

const recommendationStopWords = new Set([
  "ai", "an", "and", "app", "apps", "best", "for", "get", "give", "help",
  "i", "me", "need", "of", "on", "or", "please", "recommend", "show",
  "the", "to", "tool", "tools", "use", "want", "with",
]);

function normalizeRecommendationQuery(value: string): string {
  return value
    .toLowerCase()
    .replace(/\bvidoe\b/g, "video")
    .replace(/\bgeneratoe\b/g, "generator")
    .replace(/\bgenerater\b/g, "generator")
    .replace(/\bgenrator\b/g, "generator")
    .replace(/\bpdfs\b/g, "pdf")
    .replace(/\bdocs\b/g, "documents");
}

function tokenizeRecommendationQuery(value: string): string[] {
  const tokens = normalizeRecommendationQuery(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !recommendationStopWords.has(token));

  return Array.from(
    new Set(tokens.flatMap((token) => (token.endsWith("s") && token.length > 3 ? [token, token.slice(0, -1)] : [token]))),
  );
}

function levenshteinDistance(left: string, right: string): number {
  if (left === right) return 0;
  if (!left) return right.length;
  if (!right) return left.length;

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = Array.from({ length: right.length + 1 }, () => 0);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        current[rightIndex - 1] + 1,
        previous[rightIndex - 1] + substitutionCost,
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function fuzzySimilarity(left: string, right: string): number {
  const normalizedLeft = left.toLowerCase();
  const normalizedRight = right.toLowerCase();
  const maxLength = Math.max(normalizedLeft.length, normalizedRight.length);
  if (maxLength === 0) return 1;
  return 1 - levenshteinDistance(normalizedLeft, normalizedRight) / maxLength;
}

function searchableWords(tool: AITool, blob: string): string[] {
  return Array.from(
    new Set(
      [tool.name, tool.slug, tool.company, tool.domain, tool.category, tool.subcategory, ...blob.split(/[^a-z0-9.]+/)]
        .map((value) => value.toLowerCase().trim())
        .filter((value) => value.length > 2),
    ),
  );
}

function fuzzyToolScore(tool: AITool, blob: string, query: string, tokens: string[]): number {
  const haystack = blob;
  const words = searchableWords(tool, blob);
  const exactBoost = haystack.includes(query) ? 35 : 0;
  const tokenScore = tokens.reduce((score, token) => {
    if (haystack.includes(token)) return score + 20;
    const bestSimilarity = Math.max(...words.map((word) => fuzzySimilarity(token, word)), 0);
    return score + bestSimilarity * 18;
  }, 0);
  const qualityScore = (tool.popularityScore ?? 0) / 20 + (tool.rating ?? 0);
  return exactBoost + tokenScore + qualityScore;
}

export type LocalRecommendation = AITool & { recommendation: { score: number; reason: string } };

export function queryLocalRecommendations(
  query: string,
  limit = 8,
): { query: string; data: LocalRecommendation[] } {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return { query: normalizedQuery, data: [] };
  }

  const normalizedSearch = normalizeRecommendationQuery(normalizedQuery);
  const tokens = tokenizeRecommendationQuery(normalizedSearch);
  if (tokens.length === 0) {
    return { query: normalizedQuery, data: [] };
  }

  const { blobs } = loadLocalCatalog() ?? { blobs: new Map<string, string>() };
  const tools = getLocalTools();

  let usedFuzzyFallback = false;
  let candidates = tools.filter((tool) => tokens.some((token) => (blobs.get(tool.id) ?? "").includes(token)));

  if (candidates.length === 0) {
    usedFuzzyFallback = true;
    candidates = [...tools].sort(compareBy("popular")).slice(0, 1000);
  }

  const scored = candidates
    .map((tool) => {
      const blob = blobs.get(tool.id) ?? "";
      const exactBoost = blob.includes(normalizedSearch) ? 20 : 0;
      const tokenScore = tokens.reduce((score, token) => score + (blob.includes(token) ? 10 : 0), 0);
      const qualityScore = (tool.popularityScore ?? 0) / 10 + (tool.rating ?? 0);
      const fuzzyScore = fuzzyToolScore(tool, blob, normalizedSearch, tokens);
      return { tool, score: Math.max(exactBoost + tokenScore + qualityScore, fuzzyScore) };
    })
    .filter((item) => !usedFuzzyFallback || item.score >= 14)
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.min(20, Math.max(1, limit)));

  return {
    query: normalizedQuery,
    data: scored.map(({ tool, score }) => ({
      ...tool,
      recommendation: { score, reason: tool.shortDescription },
    })),
  };
}
