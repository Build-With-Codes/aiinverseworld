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
  const facts = [
    { label: "Pricing", value: priceLabel },
    { label: "Free plan", value: tool.freePlan },
    { label: "Category", value: tool.category },
    { label: "Platforms", value: `${tool.platforms.length || 1}` },
    ...(tool.rating ? [{ label: "Rating", value: `${tool.rating.toFixed(1)}${tool.reviewCount ? ` (${tool.reviewCount})` : ""}` }] : []),
  ].slice(0, 5);

  return (
    <div className={`relative overflow-hidden ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--brand-electric)_13%,transparent),transparent_38%,color-mix(in_srgb,var(--brand-cyan)_10%,transparent))]"
        aria-hidden
      />

      <div className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
            <FaviconBadge
              name={tool.name}
              faviconUrl={tool.favicon}
              className="h-24 w-24 shrink-0 rounded-3xl shadow-glow-cyan sm:h-28 sm:w-28 lg:h-32 lg:w-32"
              imgClassName="p-4"
              labelClassName="text-3xl"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">Verified {lastVerifiedLabel}</Badge>
                {tool.status !== "Active" ? <Badge variant="warning">{tool.status}</Badge> : null}
                <Badge variant="neutral">{tool.subcategory}</Badge>
              </div>

              <h1 className="text-display-1 mt-4 text-balance">
                <span className="text-text-primary">{tool.name}</span>
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                {tool.company} / {tool.domain}
              </p>
              <p className="text-body-lg mt-5 max-w-4xl text-text-secondary">{tool.shortDescription}</p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            <Button href={tool.website} variant="primary" size="lg" className="min-w-44 max-w-full text-center">
              Visit {tool.name}
            </Button>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <SaveButton toolId={tool.id} toolName={tool.name} variant="full" callbackUrl={`/tool/${tool.slug}`} />
              <AddToCompareButton entry={{ id: tool.id, slug: tool.slug, name: tool.name }} variant="full" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-border-subtle bg-surface-1/80 p-4">
              <p className="text-caption text-text-muted">{fact.label}</p>
              <p className="mt-1 text-base font-semibold leading-snug text-text-primary" title={fact.value}>
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
