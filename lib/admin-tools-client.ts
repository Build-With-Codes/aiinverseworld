import type { AITool } from "@/lib/catalog-types";

export type ImportCsvRowResult = {
  index: number;
  row?: number;
  ok: boolean;
  name?: string;
  slug?: string;
  error?: string;
  data?: { name?: string; slug?: string };
  vectorIndexError?: string;
};

export type ImportCsvResponse = {
  total: number;
  succeeded: number;
  failed: number;
  results: ImportCsvRowResult[];
  skipped: number;
  skippedRows: { row: number; error: string }[];
};

const BATCH_SIZE = 15;

/**
 * Each imported row does a Pinecone embed + upsert, so a big CSV in one request can blow past
 * a browser/serverless header timeout. Splitting into row-preserving quoted-newline-aware
 * batches keeps every request small while reporting original file row numbers back.
 */
function splitCsvRows(text: string): string[] {
  const rows: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
      continue;
    }
    if (char === '\n' && !inQuotes) {
      rows.push(current);
      current = '';
      continue;
    }
    if (char === '\r') continue;
    current += char;
  }
  if (current.trim() !== '') rows.push(current);

  return rows;
}

export async function importToolsCsv(
  file: File,
  onProgress?: (done: number, total: number) => void,
): Promise<ImportCsvResponse> {
  const text = await file.text();
  const rows = splitCsvRows(text);
  if (rows.length === 0) throw new Error('Empty CSV file.');

  const header = rows[0];
  const dataRows = rows.slice(1).filter((row) => row.trim() !== '');
  if (dataRows.length === 0) throw new Error('No data rows found in the CSV.');

  const aggregate: ImportCsvResponse = {
    total: 0,
    succeeded: 0,
    failed: 0,
    results: [],
    skipped: 0,
    skippedRows: [],
  };

  for (let start = 0; start < dataRows.length; start += BATCH_SIZE) {
    const batchRows = dataRows.slice(start, start + BATCH_SIZE);
    const csv = [header, ...batchRows].join('\n');

    const res = await fetch('/api/admin/tools/import-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv }),
    });
    const payload = await res.json().catch(() => null);
    if (!res.ok) {
      throw new Error(
        payload?.error ?? payload?.message ?? `Import failed on rows ${start + 2}-${start + batchRows.length + 1}.`,
      );
    }

    const batch = payload as ImportCsvResponse;
    aggregate.total += batch.total;
    aggregate.succeeded += batch.succeeded;
    aggregate.failed += batch.failed;
    aggregate.skipped += batch.skipped ?? 0;
    aggregate.results.push(
      ...batch.results.map((row) => ({
        ...row,
        index: aggregate.results.length,
        row: row.row !== undefined ? row.row + start : undefined,
      })),
    );
    if (batch.skippedRows?.length) {
      aggregate.skippedRows.push(...batch.skippedRows.map((row) => ({ ...row, row: row.row + start })));
    }

    onProgress?.(Math.min(start + batchRows.length, dataRows.length), dataRows.length);
  }

  return aggregate;
}

/**
 * Single-tool add/edit form values. List fields reuse the CSV's own `|` (and `question::answer` /
 * `feature::benefit`) conventions so the two entry paths stay mentally consistent.
 */
export type AdminToolFormValues = {
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  company: string;
  website: string;
  domain: string;
  favicon: string;
  logoUrl: string;
  shortDescription: string;
  summary: string;
  status: string;
  launchYear: string;
  rank: string;
  freePlan: string;
  freeTrial: boolean;
  pricingModel: string;
  startingPriceUsd: string;
  pricingNotes: string;
  features: string;
  bestFor: string;
  targetAudience: string;
  tags: string;
  aiType: string;
  modalities: string;
  modelProvider: string;
  modelNames: string;
  deploymentType: string;
  platforms: string;
  integrations: string;
  security: string;
  pros: string;
  cons: string;
  apiAvailable: boolean;
  openSource: boolean;
  teamCollaboration: "unknown" | "yes" | "no";
  privacyNotes: string;
  popularityScore: string;
  rating: string;
  reviewCount: string;
  lastVerified: string;
  editorialVerdict: string;
  alternativesNote: string;
  faqs: string;
  featureNotes: string;
  sourceName: string;
  sourceType: string;
  sourceUrl: string;
};

export const emptyToolFormValues: AdminToolFormValues = {
  name: "",
  slug: "",
  category: "",
  subcategory: "",
  company: "",
  website: "",
  domain: "",
  favicon: "",
  logoUrl: "",
  shortDescription: "",
  summary: "",
  status: "Active",
  launchYear: "",
  rank: "",
  freePlan: "",
  freeTrial: false,
  pricingModel: "",
  startingPriceUsd: "",
  pricingNotes: "",
  features: "",
  bestFor: "",
  targetAudience: "",
  tags: "",
  aiType: "",
  modalities: "",
  modelProvider: "",
  modelNames: "",
  deploymentType: "",
  platforms: "",
  integrations: "",
  security: "",
  pros: "",
  cons: "",
  apiAvailable: false,
  openSource: false,
  teamCollaboration: "unknown",
  privacyNotes: "",
  popularityScore: "",
  rating: "",
  reviewCount: "",
  lastVerified: "",
  editorialVerdict: "",
  alternativesNote: "",
  faqs: "",
  featureNotes: "",
  sourceName: "",
  sourceType: "",
  sourceUrl: "",
};

function splitList(value: string): string[] {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value?: string[] | null): string {
  return (value ?? []).join(" | ");
}

function splitPairLines(value: string): [string, string][] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf("::");
      return idx === -1
        ? ([line, ""] as [string, string])
        : ([line.slice(0, idx).trim(), line.slice(idx + 2).trim()] as [string, string]);
    })
    .filter(([a, b]) => a && b);
}

function joinFaqLines(faqs?: { question: string; answer: string }[]): string {
  return (faqs ?? []).map((faq) => `${faq.question}::${faq.answer}`).join("\n");
}

function joinFeatureNoteLines(notes?: { feature: string; benefit: string }[]): string {
  return (notes ?? []).map((note) => `${note.feature}::${note.benefit}`).join("\n");
}

export function toolToFormValues(tool: AITool): AdminToolFormValues {
  return {
    name: tool.name,
    slug: tool.slug,
    category: tool.category,
    subcategory: tool.subcategory ?? "",
    company: tool.company ?? "",
    website: tool.website ?? "",
    domain: tool.domain ?? "",
    favicon: tool.favicon ?? "",
    logoUrl: tool.logoUrl ?? "",
    shortDescription: tool.shortDescription,
    summary: tool.summary ?? "",
    status: tool.status ?? "Active",
    launchYear: tool.launchYear != null ? String(tool.launchYear) : "",
    rank: tool.rank != null ? String(tool.rank) : "",
    freePlan: tool.freePlan ?? "",
    freeTrial: Boolean(tool.freeTrial),
    pricingModel: tool.pricingModel ?? "",
    startingPriceUsd: tool.startingPriceUsd != null ? String(tool.startingPriceUsd) : "",
    pricingNotes: tool.pricingNotes ?? "",
    features: joinList(tool.features),
    bestFor: joinList(tool.bestFor),
    targetAudience: joinList(tool.targetAudience),
    tags: joinList(tool.tags),
    aiType: joinList(tool.aiType),
    modalities: joinList(tool.modalities),
    modelProvider: joinList(tool.modelProvider),
    modelNames: joinList(tool.modelNames),
    deploymentType: joinList(tool.deploymentType),
    platforms: joinList(tool.platforms),
    integrations: joinList(tool.integrations),
    security: joinList(tool.security),
    pros: joinList(tool.pros),
    cons: joinList(tool.cons),
    apiAvailable: Boolean(tool.apiAvailable),
    openSource: Boolean(tool.openSource),
    teamCollaboration: tool.teamCollaboration === true ? "yes" : tool.teamCollaboration === false ? "no" : "unknown",
    privacyNotes: tool.privacyNotes ?? "",
    popularityScore: tool.popularityScore != null ? String(tool.popularityScore) : "",
    rating: tool.rating != null ? String(tool.rating) : "",
    reviewCount: tool.reviewCount != null ? String(tool.reviewCount) : "",
    lastVerified: tool.lastVerified ? tool.lastVerified.slice(0, 10) : "",
    editorialVerdict: tool.editorialVerdict ?? "",
    alternativesNote: tool.alternativesNote ?? "",
    faqs: joinFaqLines(tool.faqs),
    featureNotes: joinFeatureNoteLines(tool.featureNotes),
    sourceName: "",
    sourceType: tool.sourceType ?? "",
    sourceUrl: tool.sourceUrl ?? "",
  };
}

function buildToolPayload(values: AdminToolFormValues) {
  const num = (raw: string) => (raw.trim() === "" ? null : Number(raw));

  return {
    name: values.name.trim(),
    slug: values.slug.trim() || undefined,
    category: values.category.trim(),
    subcategory: values.subcategory.trim() || undefined,
    company: values.company.trim() || undefined,
    website: values.website.trim() || undefined,
    domain: values.domain.trim() || undefined,
    favicon: values.favicon.trim() || undefined,
    logoUrl: values.logoUrl.trim() || null,
    shortDescription: values.shortDescription.trim(),
    summary: values.summary.trim() || null,
    status: values.status.trim() || undefined,
    launchYear: num(values.launchYear),
    rank: num(values.rank),
    freePlan: values.freePlan.trim() || undefined,
    freeTrial: values.freeTrial,
    pricingModel: values.pricingModel.trim() || undefined,
    startingPriceUsd: num(values.startingPriceUsd),
    pricingNotes: values.pricingNotes.trim() || null,
    features: splitList(values.features),
    bestFor: splitList(values.bestFor),
    targetAudience: splitList(values.targetAudience),
    tags: splitList(values.tags),
    aiType: splitList(values.aiType),
    modalities: splitList(values.modalities),
    modelProvider: splitList(values.modelProvider),
    modelNames: splitList(values.modelNames),
    deploymentType: splitList(values.deploymentType),
    platforms: splitList(values.platforms),
    integrations: splitList(values.integrations),
    security: splitList(values.security),
    pros: splitList(values.pros),
    cons: splitList(values.cons),
    apiAvailable: values.apiAvailable,
    openSource: values.openSource,
    teamCollaboration:
      values.teamCollaboration === "yes" ? true : values.teamCollaboration === "no" ? false : null,
    privacyNotes: values.privacyNotes.trim() || null,
    // popularityScore, rating, and reviewCount are never sent — they're fully
    // computed by the backend (engagement recompute / real review aggregates),
    // never admin-settable.
    lastVerified: values.lastVerified.trim() || null,
    editorialVerdict: values.editorialVerdict.trim() || null,
    alternativesNote: values.alternativesNote.trim() || null,
    faqs: splitPairLines(values.faqs).map(([question, answer]) => ({ question, answer })),
    featureNotes: splitPairLines(values.featureNotes).map(([feature, benefit]) => ({ feature, benefit })),
    sourceName: values.sourceName.trim() || undefined,
    sourceType: values.sourceType.trim() || undefined,
    sourceUrl: values.sourceUrl.trim() || undefined,
  };
}

export type SaveToolResponse = {
  data: { id: string; slug: string; name: string };
  vectorIndex: { toolId: string; chunks: number } | null;
  vectorIndexError?: string;
};

export async function saveTool(values: AdminToolFormValues, id?: string): Promise<SaveToolResponse> {
  const payload = buildToolPayload(values);

  const res = await fetch(id ? `/api/admin/tools/${encodeURIComponent(id)}` : "/api/admin/tools", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? data?.message ?? "Failed to save tool.");
  return data as SaveToolResponse;
}

export async function reindexTool(id: string) {
  const res = await fetch(`/api/admin/tools/${encodeURIComponent(id)}/reindex`, { method: "POST" });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? data?.message ?? "Failed to reindex tool.");
  return data as { toolId: string; chunks: number };
}
