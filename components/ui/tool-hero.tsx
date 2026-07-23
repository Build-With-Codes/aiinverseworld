import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
import { FaviconBadge } from "@/components/favicon-badge";
import { AddToCompareButton } from "@/components/engagement/add-to-compare-button";
import { SaveButton } from "@/components/engagement/save-button";
import type { AITool } from "@/lib/catalog-types";

type ToolHeroProps = {
  tool: AITool;
  priceLabel: string;
  lastVerifiedLabel: string;
};

export function ToolHero({ tool, priceLabel, lastVerifiedLabel }: ToolHeroProps) {
  return (
    <div className={`relative overflow-hidden ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-wrap items-start gap-6">
        <FaviconBadge
          name={tool.name}
          faviconUrl={tool.favicon}
          className="h-16 w-16 shrink-0 rounded-2xl shadow-glow-cyan"
          imgClassName="p-2.5"
          labelClassName="text-lg"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{tool.category}</Badge>
            <Badge variant="neutral">{tool.subcategory}</Badge>
            <Badge variant="neutral">{tool.pricingModel}</Badge>
            <Badge variant="success">Verified {lastVerifiedLabel}</Badge>
            {tool.status !== "Active" ? <Badge variant="warning">{tool.status}</Badge> : null}
          </div>
          <h1 className="text-display-2 mt-4 text-text-primary">{tool.name}</h1>
          <p className="text-caption mt-1 text-text-muted">
            {tool.company} · {tool.domain}
          </p>
          <p className="text-body-lg mt-3 max-w-3xl text-text-secondary">{tool.shortDescription}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button href={tool.website} variant="primary" size="lg">
              Visit {tool.name} →
            </Button>
            <SaveButton
              toolId={tool.id}
              toolName={tool.name}
              variant="full"
              callbackUrl={`/tool/${tool.slug}`}
            />
            <AddToCompareButton
              entry={{ id: tool.id, slug: tool.slug, name: tool.name }}
              variant="full"
            />
            <span className="text-heading-2 text-text-primary">{priceLabel}</span>
            {tool.rating ? (
              <span className="text-body flex items-center gap-1.5 text-text-secondary">
                <span className="text-amber-300">★</span>
                {tool.rating.toFixed(1)}
                {tool.reviewCount ? ` · ${tool.reviewCount} reviews` : ""}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
