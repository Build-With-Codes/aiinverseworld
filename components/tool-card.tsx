import Link from "next/link";

import { SaveButton } from "@/components/engagement/save-button";
import { FaviconBadge } from "@/components/favicon-badge";
import { Badge } from "@/components/ui/badge";
import { cardClass } from "@/components/ui/card";
import type { AITool } from "@/lib/catalog-types";

type ToolCardProps = {
  tool: AITool;
};

/**
 * Discovery-grid card. Hierarchy is deliberate — logo/name, one-line value
 * prop, category, pricing, rating, in that order — everything else
 * (platforms, modalities, full "best for" list) belongs on the tool detail
 * page, not crammed into a scanning-density grid card.
 */
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
          <p className="line-clamp-1 font-semibold leading-snug text-text-primary">{tool.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge variant="brand">{tool.category}</Badge>
            {tool.status !== "Active" ? <Badge variant="warning">{tool.status}</Badge> : null}
          </div>
        </div>
      </div>

      <p className="text-body mb-5 line-clamp-2 text-text-secondary">{tool.shortDescription}</p>

      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {tool.freePlan === "Yes" ? <Badge variant="success">Free plan</Badge> : null}
          {tool.openSource ? <Badge variant="success">Open source</Badge> : null}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border-subtle pt-3 text-sm">
          <span className="min-w-0 truncate text-text-muted">{tool.pricingModel}</span>
          <span className="flex shrink-0 items-center gap-1.5 font-semibold text-text-primary">
            {priceLabel}
            <span
              aria-hidden
              className="text-text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:text-brand-electric-strong group-hover:opacity-100"
            >
              →
            </span>
          </span>
        </div>
        {tool.rating ? (
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="text-amber-300">★</span>
            <span className="font-medium text-text-secondary">{tool.rating.toFixed(1)}</span>
            {tool.reviewCount ? <span>({tool.reviewCount})</span> : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
