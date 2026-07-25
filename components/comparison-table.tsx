import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { FaviconBadge } from "@/components/favicon-badge";
import type { AITool } from "@/lib/catalog-types";

type ComparisonTableProps = {
  tools: AITool[];
  highlightDifferences?: boolean;
};

type CellType = "text" | "chips" | "bool" | "price" | "rating" | "bullets" | "paragraph";

type ToneKey = "cyan" | "emerald" | "violet" | "blue" | "amber" | "rose";

const TONES: Record<ToneKey, { text: string; dot: string; divider: string; chip: string; rowTint: string }> = {
  cyan: {
    text: "text-cyan-300",
    dot: "bg-cyan-400",
    divider: "border-cyan-400/40 bg-cyan-400/10",
    chip: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    rowTint: "bg-cyan-400/5",
  },
  emerald: {
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    divider: "border-emerald-400/40 bg-emerald-400/10",
    chip: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    rowTint: "bg-emerald-400/5",
  },
  violet: {
    text: "text-violet-300",
    dot: "bg-violet-400",
    divider: "border-violet-400/40 bg-violet-400/10",
    chip: "border-violet-400/25 bg-violet-400/10 text-violet-200",
    rowTint: "bg-violet-400/5",
  },
  blue: {
    text: "text-blue-300",
    dot: "bg-blue-400",
    divider: "border-blue-400/40 bg-blue-400/10",
    chip: "border-blue-400/25 bg-blue-400/10 text-blue-200",
    rowTint: "bg-blue-400/5",
  },
  amber: {
    text: "text-amber-300",
    dot: "bg-amber-400",
    divider: "border-amber-400/40 bg-amber-400/10",
    chip: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    rowTint: "bg-amber-400/5",
  },
  rose: {
    text: "text-rose-300",
    dot: "bg-rose-400",
    divider: "border-rose-400/40 bg-rose-400/10",
    chip: "border-rose-400/25 bg-rose-400/10 text-rose-200",
    rowTint: "bg-rose-400/5",
  },
};

type Row = {
  label: string;
  key: keyof AITool;
  type: CellType;
  tone?: "positive" | "negative";
};

type Section = {
  title: string;
  tone: ToneKey;
  rows: Row[];
};

const sections: Section[] = [
  {
    title: "Overview",
    tone: "cyan",
    rows: [
      { label: "Rating", key: "rating", type: "rating" },
      { label: "Category", key: "category", type: "text" },
      { label: "Subcategory", key: "subcategory", type: "text" },
      { label: "Company", key: "company", type: "text" },
      { label: "Status", key: "status", type: "text" },
      { label: "Launch year", key: "launchYear", type: "text" },
      { label: "Tags", key: "tags", type: "chips" },
    ],
  },
  {
    title: "Pricing",
    tone: "emerald",
    rows: [
      { label: "Starting price", key: "startingPriceUsd", type: "price" },
      { label: "Pricing model", key: "pricingModel", type: "text" },
      { label: "Free plan", key: "freePlan", type: "text" },
      { label: "Free trial", key: "freeTrial", type: "bool" },
      { label: "Pricing notes", key: "pricingNotes", type: "paragraph" },
    ],
  },
  {
    title: "Capabilities",
    tone: "violet",
    rows: [
      { label: "Best for", key: "bestFor", type: "chips" },
      { label: "Target audience", key: "targetAudience", type: "chips" },
      { label: "AI type", key: "aiType", type: "chips" },
      { label: "Modalities", key: "modalities", type: "chips" },
    ],
  },
  {
    title: "Technical",
    tone: "blue",
    rows: [
      { label: "Model provider", key: "modelProvider", type: "chips" },
      { label: "Model names", key: "modelNames", type: "chips" },
      { label: "API available", key: "apiAvailable", type: "bool" },
      { label: "Open source", key: "openSource", type: "bool" },
      { label: "Deployment", key: "deploymentType", type: "chips" },
      { label: "Platforms", key: "platforms", type: "chips" },
      { label: "Integrations", key: "integrations", type: "chips" },
      { label: "Team collaboration", key: "teamCollaboration", type: "bool" },
    ],
  },
  {
    title: "Trust & security",
    tone: "amber",
    rows: [
      { label: "Security", key: "security", type: "chips" },
      { label: "Privacy notes", key: "privacyNotes", type: "paragraph" },
    ],
  },
  {
    title: "Verdict",
    tone: "rose",
    rows: [
      { label: "Pros", key: "pros", type: "bullets", tone: "positive" },
      { label: "Cons", key: "cons", type: "bullets", tone: "negative" },
    ],
  },
];

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function comparableValue(tool: AITool, row: Row): string {
  const value = tool[row.key];
  if (Array.isArray(value)) return [...value].map(String).sort().join("|");
  if (value === null || value === undefined) return "";
  return String(value);
}

function Dash() {
  return <span className="text-text-muted">—</span>;
}

function BoolMark({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${
        ok ? "bg-emerald-500" : "bg-rose-500/85"
      }`}
      aria-label={ok ? "Yes" : "No"}
    >
      {ok ? "✓" : "✕"}
    </span>
  );
}

function ChipList({ items, chipClass }: { items: string[]; chipClass: string }) {
  if (items.length === 0) return <Dash />;

  // Some sources put a full sentence in a normally-short-tag field (e.g. a
  // free-text security note). Pill styling looks broken on a sentence, so
  // fall back to plain text when every item is long.
  if (items.every((item) => item.length > 40)) {
    return (
      <div className="space-y-1.5">
        {items.map((item) => (
          <p key={item} className="text-sm leading-6 text-text-secondary">
            {item}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={`inline-flex items-center rounded-pill border px-3 py-1 text-xs font-semibold tracking-[0.1em] uppercase ${chipClass}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items, tone }: { items: string[]; tone?: "positive" | "negative" }) {
  if (items.length === 0) return <Dash />;
  const negative = tone === "negative";
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-6 text-text-secondary">
          <span
            aria-hidden
            className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
              negative ? "bg-rose-500/85" : "bg-emerald-500"
            }`}
          >
            {negative ? "✕" : "✓"}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RatingCell({ tool, isTopRated }: { tool: AITool; isTopRated: boolean }) {
  if (!tool.rating) return <Dash />;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary">
        <span aria-hidden className="text-amber-300">
          ★
        </span>
        {tool.rating.toFixed(1)}
      </span>
      {tool.reviewCount ? (
        <span className="text-caption text-text-muted">{tool.reviewCount.toLocaleString()} reviews</span>
      ) : null}
      {isTopRated ? <Badge variant="success">Top rated</Badge> : null}
    </div>
  );
}

function PriceCell({ tool, isBestValue }: { tool: AITool; isBestValue: boolean }) {
  const price = tool.startingPriceUsd;
  const label = price === null ? "Custom pricing" : price === 0 ? "Free" : `$${price}/mo`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`text-sm font-semibold ${price === 0 ? "text-emerald-300" : "text-text-primary"}`}>
        {label}
      </span>
      {isBestValue ? <Badge variant="brand">Best value</Badge> : null}
    </div>
  );
}

function renderCell(
  tool: AITool,
  row: Row,
  extras: { isBestValue: boolean; isTopRated: boolean; chipClass: string },
) {
  const value = tool[row.key];

  switch (row.type) {
    case "bool":
      return value === null || value === undefined ? <Dash /> : <BoolMark ok={Boolean(value)} />;
    case "price":
      return <PriceCell tool={tool} isBestValue={extras.isBestValue} />;
    case "rating":
      return <RatingCell tool={tool} isTopRated={extras.isTopRated} />;
    case "chips":
      return <ChipList items={asStringArray(value)} chipClass={extras.chipClass} />;
    case "bullets":
      return <BulletList items={asStringArray(value)} tone={row.tone} />;
    case "paragraph":
      return value ? <p className="text-sm leading-6 text-text-secondary">{String(value)}</p> : <Dash />;
    default:
      return value === null || value === undefined || value === "" ? <Dash /> : <span>{String(value)}</span>;
  }
}

export function ComparisonTable({ tools, highlightDifferences = false }: ComparisonTableProps) {
  if (tools.length < 2) return null;

  const priced = tools.filter((tool) => tool.startingPriceUsd !== null);
  const bestValueId =
    priced.length >= 2
      ? priced.reduce((min, tool) =>
          (tool.startingPriceUsd ?? Infinity) < (min.startingPriceUsd ?? Infinity) ? tool : min,
        ).id
      : null;
  const rated = tools.filter((tool) => tool.rating);
  const topRatedId =
    rated.length >= 2 ? rated.reduce((max, tool) => ((tool.rating ?? 0) > (max.rating ?? 0) ? tool : max)).id : null;

  const gridTemplate = `minmax(180px, 1.1fr) repeat(${tools.length}, minmax(180px, 1fr))`;

  return (
    <div className="no-scrollbar overflow-hidden overflow-x-auto rounded-card-lg border border-border-subtle bg-surface-2 backdrop-blur-xl">
      <div className="premium-gradient h-1 w-full" aria-hidden />
      <div className="grid gap-px bg-border-subtle" style={{ gridTemplateColumns: gridTemplate }}>
        {/* Header row: identity per tool */}
        <div className="sticky left-0 top-0 z-20 bg-surface-1 p-4" />
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tool/${tool.slug}`}
            className="group sticky top-0 z-10 flex items-center gap-3 bg-surface-1 p-4 transition hover:bg-surface-1/80"
          >
            <FaviconBadge
              name={tool.name}
              faviconUrl={tool.favicon}
              className="h-10 w-10 shrink-0 rounded-2xl"
              imgClassName="p-1.5"
              labelClassName="text-sm"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-text-primary group-hover:text-brand-cyan-strong">
                {tool.name}
              </p>
              <p className="truncate text-caption text-text-muted">{tool.company}</p>
            </div>
          </Link>
        ))}

        {sections.map((section) => {
          const tone = TONES[section.tone];

          return (
            <div key={section.title} className="contents">
              {/* Section divider */}
              <div
                className={`flex items-center gap-2 border-l-4 px-5 py-2.5 text-eyebrow ${tone.divider} ${tone.text}`}
                style={{ gridColumn: `1 / span ${tools.length + 1}` }}
              >
                {section.title}
              </div>

              {section.rows.map((row) => {
                const differs = highlightDifferences && new Set(tools.map((t) => comparableValue(t, row))).size > 1;
                const cellBg = differs ? tone.rowTint : "bg-surface-2";

                return (
                  <div key={row.label} className="contents">
                    <div className={`sticky left-0 z-[5] ${cellBg} p-5 text-sm font-medium text-text-secondary`}>
                      {differs ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
                          {row.label}
                        </span>
                      ) : (
                        row.label
                      )}
                    </div>
                    {tools.map((tool) => (
                      <div key={`${row.label}-${tool.slug}`} className={`${cellBg} p-5`}>
                        {renderCell(tool, row, {
                          isBestValue: tool.id === bestValueId,
                          isTopRated: tool.id === topRatedId,
                          chipClass: tone.chip,
                        })}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
