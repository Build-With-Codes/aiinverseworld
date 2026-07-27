import Link from "next/link";

import { SaveButton } from "@/components/engagement/save-button";
import { FaviconBadge } from "@/components/favicon-badge";
import { Badge } from "@/components/ui/badge";
import { cardClass } from "@/components/ui/card";
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
    <Link
      href={`/tool/${tool.slug}?id=${encodeURIComponent(tool.id)}`}
      className={`group relative flex h-full flex-col ${cardClass({ hover: true })}`}
    >
      <div className="absolute right-4 top-4 z-10">
        <SaveButton toolId={tool.id} toolName={tool.name} callbackUrl={`/tool/${tool.slug}`} />
      </div>

      <div className="mb-3 flex items-start gap-3 pr-11">
        <FaviconBadge
          name={tool.name}
          faviconUrl={tool.favicon}
          className="h-12 w-12 shrink-0 rounded-2xl shadow-glow-cyan"
          imgClassName="p-2"
          labelClassName="text-sm"
        />

        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-semibold leading-snug text-text-primary">{tool.name}</p>
          <p className="text-caption mt-1 line-clamp-1 text-text-muted">
            {tool.company} / {tool.subcategory}
          </p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <Badge variant="brand">{tool.category}</Badge>
        {tool.status !== "Active" ? <Badge variant="warning">{tool.status}</Badge> : null}
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
        {tool.platforms.slice(0, 3).map((platform) => (
          <span key={platform} className="rounded-sm bg-surface-3 px-2 py-0.5 text-[11px] text-text-muted">
            {platform}
          </span>
        ))}
        {tool.modalities.slice(0, 3).map((modality) => (
          <span key={modality} className="rounded-sm bg-brand-violet/8 px-2 py-0.5 text-[11px] text-brand-violet-strong">
            {modality}
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
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="min-w-0 text-text-muted">{tool.pricingModel}</span>
          <span className="shrink-0 font-medium text-text-primary">{priceLabel}</span>
        </div>
        {tool.rating ? (
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="text-amber-300">★</span>
            <span>{tool.rating.toFixed(1)}</span>
            {tool.reviewCount ? <span>/ {tool.reviewCount} reviews</span> : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
