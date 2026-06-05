import Link from "next/link";

import type { Tool } from "@/lib/site-data";

type ToolCardProps = {
  tool: Tool;
};

function ratingWidth(rating: number) {
  return `${(rating / 5) * 100}%`;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="group flex h-full flex-col rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(4,10,25,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/8"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400/80 via-blue-500/80 to-indigo-500/80 text-sm font-semibold text-white shadow-[0_0_40px_rgba(34,211,238,0.28)]">
              {tool.name.slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-white">{tool.name}</p>
              <p className="text-sm text-slate-400">{tool.category}</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-300">{tool.tagline}</p>
        </div>
        {tool.badge ? (
          <div className="flex flex-col items-end gap-2">
            <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-cyan-200 uppercase">
              {tool.badge}
            </span>
            {tool.sponsored ? (
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-amber-200 uppercase">
                Sponsored
              </span>
            ) : null}
          </div>
        ) : null}
        {!tool.badge && tool.sponsored ? (
          <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-amber-200 uppercase">
            Sponsored
          </span>
        ) : null}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/8 bg-white/6 px-3 py-1 text-xs text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">{tool.pricing}</span>
          <span className="text-slate-400">{tool.monthlyVisits} monthly visits</span>
        </div>
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-white/8">
            <div
              className="h-2 rounded-full bg-linear-to-r from-cyan-300 via-blue-400 to-violet-400"
              style={{ width: ratingWidth(tool.rating) }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>{tool.rating.toFixed(1)} / 5</span>
            <span>{tool.reviewsCount} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
