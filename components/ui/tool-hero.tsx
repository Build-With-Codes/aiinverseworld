import { AddToCompareButton } from "@/components/engagement/add-to-compare-button";
import { SaveButton } from "@/components/engagement/save-button";
import { FaviconBadge } from "@/components/favicon-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
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
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-brand-cyan/20 to-brand-violet/20 blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <div className="flex items-start gap-4">
          <FaviconBadge
            name={tool.name}
            faviconUrl={tool.favicon}
            className="h-20 w-20 shrink-0 rounded-2xl shadow-glow-cyan sm:h-24 sm:w-24"
            imgClassName="p-3.5"
            labelClassName="text-2xl"
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
              {tool.company} / {tool.domain}
            </p>
          </div>
        </div>

        <p className="text-body-lg mt-5 max-w-4xl text-text-secondary">{tool.shortDescription}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button href={tool.website} variant="primary" size="lg">
            Visit {tool.name}
          </Button>
          <SaveButton toolId={tool.id} toolName={tool.name} variant="full" callbackUrl={`/tool/${tool.slug}`} />
          <AddToCompareButton entry={{ id: tool.id, slug: tool.slug, name: tool.name }} variant="full" />
          <span className="text-heading-2 text-text-primary">{priceLabel}</span>
          {tool.rating ? (
            <span className="text-body flex items-center gap-1.5 text-text-secondary">
              <span className="text-amber-300">★</span>
              {tool.rating.toFixed(1)}
              {tool.reviewCount ? ` / ${tool.reviewCount} reviews` : ""}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
