import { AddToCompareButton } from "@/components/engagement/add-to-compare-button";
import { SaveButton } from "@/components/engagement/save-button";
import { FaviconBadge } from "@/components/favicon-badge";
import type { AITool } from "@/lib/catalog-types";

/**
 * Slim action bar that stays reachable while reading a long tool page. It's a
 * CSS-sticky element (pins just under the header once the hero scrolls past) —
 * no scroll listener, and it never occupies the bottom thumb-zone where the
 * compare tray and cookie banner live.
 */
export function ToolActionBar({ tool }: { tool: AITool }) {
  return (
    <div className="sticky top-[76px] z-30">
      <div className="flex items-center justify-between gap-3 rounded-pill border border-border-subtle bg-surface-glass px-3 py-2 shadow-card backdrop-blur-xl sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <FaviconBadge
            name={tool.name}
            faviconUrl={tool.favicon}
            className="h-8 w-8 shrink-0 rounded-xl"
            imgClassName="p-1.5"
            labelClassName="text-xs"
          />
          <span className="truncate font-semibold text-text-primary">{tool.name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SaveButton toolId={tool.id} toolName={tool.name} variant="icon" callbackUrl={`/tool/${tool.slug}`} />
          <AddToCompareButton
            entry={{ id: tool.id, slug: tool.slug, name: tool.name }}
            variant="icon"
          />
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-4 py-2 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
          >
            Visit
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
