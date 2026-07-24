import Link from "next/link";

import { FaviconBadge } from "@/components/favicon-badge";
import { Badge } from "@/components/ui/badge";
import type { Spotlight } from "@/lib/catalog-types";

/** Premium, visually distinct spotlight (Tool of the Day/Week/Month, etc). */
export function SpotlightCard({ spotlight }: { spotlight: Spotlight }) {
  const { tool } = spotlight;
  const priceLabel =
    tool.startingPriceUsd === null
      ? "Usage-based"
      : tool.startingPriceUsd === 0
        ? "Free"
        : `From $${tool.startingPriceUsd}/mo`;

  return (
    <Link
      href={`/tool/${tool.slug}?id=${encodeURIComponent(tool.id)}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-card-lg border border-border-accent bg-gradient-to-br from-brand-electric/10 via-brand-violet/8 to-transparent p-6 shadow-glow-violet transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-cyan/20 blur-3xl"
        aria-hidden
      />
      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan-strong">
          <span aria-hidden className="text-lg">
            {spotlight.emoji}
          </span>
          {spotlight.label}
        </span>
      </div>

      <div className="relative mt-5 flex items-center gap-3">
        <FaviconBadge
          name={tool.name}
          faviconUrl={tool.favicon}
          className="h-14 w-14 rounded-2xl shadow-glow-cyan"
          imgClassName="p-2.5"
          labelClassName="text-base"
        />
        <div>
          <p className="text-heading-2 text-text-primary">{tool.name}</p>
          <p className="text-caption text-text-muted">{tool.category}</p>
        </div>
      </div>

      <p className="text-body mt-4 text-text-secondary">{tool.shortDescription}</p>
      <p className="text-caption mt-3 italic text-text-muted">{spotlight.blurb}</p>

      <div className="mt-auto flex items-center justify-between pt-5">
        <Badge variant="brand">{priceLabel}</Badge>
        <span className="text-sm font-semibold text-brand-cyan-strong group-hover:underline">
          Explore
        </span>
      </div>
    </Link>
  );
}
