import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cardClass } from "@/components/ui/card";
import { FaviconBadge } from "@/components/favicon-badge";
import type { AITool } from "@/lib/catalog-types";

type ToolCardProps = {
  tool: AITool;
};

export function ToolCard({ tool }: ToolCardProps) {
  const priceLabel =
    tool.startingPriceUsd === null
      ? "Usage-based"
      : tool.startingPriceUsd === 0
        ? "Free"
        : `From $${tool.startingPriceUsd}/mo`;

  return (
    <Link href={`/tool/${tool.slug}?id=${encodeURIComponent(tool.id)}`} className={`group flex h-full flex-col ${cardClass({ hover: true })}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <FaviconBadge
            name={tool.name}
            faviconUrl={tool.favicon}
            className="h-12 w-12 rounded-2xl shadow-glow-cyan"
            imgClassName="p-2"
            labelClassName="text-sm"
          />
          <div>
            <p className="font-semibold text-text-primary">{tool.name}</p>
            <p className="text-caption text-text-muted">
              {tool.company} · {tool.subcategory}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge variant="brand">{tool.category}</Badge>
          {tool.status !== "Active" ? <Badge variant="warning">{tool.status}</Badge> : null}
        </div>
      </div>

      <p className="text-body mb-4 text-text-secondary">{tool.shortDescription}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {tool.bestFor.slice(0, 3).map((item) => (
          <span
            key={item}
            className="rounded-pill border border-border-subtle bg-surface-3 px-3 py-1 text-sm text-text-secondary"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {tool.platforms.slice(0, 3).map((p) => (
          <span key={p} className="rounded-sm bg-surface-3 px-2 py-0.5 text-[11px] text-text-muted">
            {p}
          </span>
        ))}
        {tool.modalities.slice(0, 3).map((m) => (
          <span key={m} className="rounded-sm bg-brand-violet/8 px-2 py-0.5 text-[11px] text-brand-violet-strong">
            {m}
          </span>
        ))}
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {tool.openSource ? <Badge variant="success">Open Source</Badge> : null}
          {tool.apiAvailable ? <Badge variant="brand">API</Badge> : null}
          {tool.teamCollaboration ? <Badge variant="neutral">Teams</Badge> : null}
          {tool.freePlan === "Yes" ? <Badge variant="success">Free plan</Badge> : null}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">{tool.pricingModel}</span>
          <span className="font-medium text-text-primary">{priceLabel}</span>
        </div>
        {tool.rating ? (
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="text-amber-300">★</span>
            <span>{tool.rating.toFixed(1)}</span>
            {tool.reviewCount ? <span>· {tool.reviewCount} reviews</span> : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
