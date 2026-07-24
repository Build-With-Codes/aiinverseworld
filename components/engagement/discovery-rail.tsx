import Link from "next/link";

import { RailScroller } from "@/components/engagement/rail-scroller";
import { ToolCard } from "@/components/tool-card";
import { FadeInSection } from "@/components/ui/motion";
import type { AITool } from "@/lib/catalog-types";

type DiscoveryRailProps = {
  eyebrow: string;
  title: string;
  description?: string;
  tools: AITool[];
  viewAllHref?: string;
  viewAllLabel?: string;
};

/**
 * Horizontal-scrolling rail of tool cards. Used for Trending / Similar /
 * Recently Viewed / Most Saved / Personalized discovery sections. The whole
 * page body never scrolls sideways — the rail owns its own overflow.
 */
export function DiscoveryRail({
  eyebrow,
  title,
  description,
  tools,
  viewAllHref,
  viewAllLabel = "View all",
}: DiscoveryRailProps) {
  if (tools.length === 0) return null;

  return (
    <FadeInSection>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="max-w-3xl space-y-2">
          <span className="text-eyebrow text-brand-cyan-strong">{eyebrow}</span>
          <h2 className="text-heading-1 text-text-primary">{title}</h2>
          {description ? <p className="text-body text-text-secondary">{description}</p> : null}
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="shrink-0 text-sm font-semibold text-brand-cyan-strong transition hover:text-brand-cyan"
          >
            {viewAllLabel}
          </Link>
        ) : null}
      </div>

      <RailScroller>
        {tools.map((tool) => (
          <div key={tool.slug} className="w-[300px] shrink-0 snap-start sm:w-[340px]">
            <ToolCard tool={tool} />
          </div>
        ))}
      </RailScroller>
    </FadeInSection>
  );
}
