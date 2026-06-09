import { FaviconBadge } from "@/components/favicon-badge";
import Link from "next/link";

import type { AITool } from "@/lib/site-data";

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
      href={`/tool/${tool.slug}`}
      className="group flex h-full flex-col rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(4,10,25,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/8"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <FaviconBadge
            name={tool.name}
            faviconUrl={tool.favicon}
            className="h-12 w-12 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.18)]"
            imgClassName="p-2"
            labelClassName="text-sm"
          />
          <div>
            <p className="font-semibold text-white">{tool.name}</p>
            <p className="text-xs text-slate-400">{tool.company} · {tool.subcategory}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-cyan-200 uppercase">
            {tool.category}
          </span>
          {tool.status !== "Active" && (
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold text-amber-200">
              {tool.status}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-sm leading-6 text-slate-300">{tool.shortDescription}</p>

      {/* Tags */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tool.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-xs text-slate-400"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Best for */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tool.bestFor.slice(0, 3).map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/8 bg-white/6 px-3 py-1 text-xs text-slate-300"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Platforms + modalities */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tool.platforms.slice(0, 3).map((p) => (
          <span key={p} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">{p}</span>
        ))}
        {tool.modalities.slice(0, 3).map((m) => (
          <span key={m} className="rounded-md bg-violet-300/8 px-2 py-0.5 text-[11px] text-violet-300">{m}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {tool.openSource && (
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] text-emerald-300">Open Source</span>
          )}
          {tool.apiAvailable && (
            <span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-2.5 py-1 text-[11px] text-blue-300">API</span>
          )}
          {tool.teamCollaboration && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">Teams</span>
          )}
          {tool.freePlan === "Yes" && (
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] text-emerald-300">Free plan</span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">{tool.pricingModel}</span>
          <span className="font-medium text-white">{priceLabel}</span>
        </div>
        {tool.rating && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-amber-300">★</span>
            <span>{tool.rating.toFixed(1)}</span>
            {tool.reviewCount && <span>· {tool.reviewCount} reviews</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
