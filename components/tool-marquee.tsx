"use client";

import Link from "next/link";
import type { AITool } from "@/lib/site-data";

type Props = {
  tools: AITool[];
  direction?: "left" | "right";
};

export function ToolMarquee({ tools, direction = "left" }: Props) {
  const doubled = [...tools, ...tools];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className="flex gap-3 w-max"
        style={{
          animation: `marquee-${direction} 40s linear infinite`,
        }}
      >
        {doubled.map((tool, i) => (
          <Link
            key={`${tool.slug}-${i}`}
            href={`/tool/${tool.slug}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-white/10 hover:text-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tool.favicon}
              alt=""
              width={16}
              height={16}
              className="rounded-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <span>{tool.name}</span>
            {tool.rating && (
              <span className="text-xs text-amber-300">★ {tool.rating.toFixed(1)}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
