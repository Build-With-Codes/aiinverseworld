import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Search AI Tools | AiverseWorld",
  description: "Search, filter, and explore AI tools with dummy discovery data.",
};

const filters = [
  "Category",
  "Pricing",
  "Platform",
  "Rating",
  "Tags",
];

export default function SearchPage() {
  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Search"
          title="Instant discovery with practical filters"
          description="Search across real tools, official websites, price signals, and use cases from the live catalog."
        />
        <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <input
            aria-label="Search query"
            placeholder="best AI coding tools under $20"
            className="rounded-2xl border border-white/10 bg-[#071120] px-5 py-4 text-sm text-slate-300 outline-none"
          />
          <div className="grid gap-3 sm:grid-cols-5">
            {filters.map((filter) => (
              <button
                key={filter}
                className="rounded-2xl border border-white/10 bg-[#081222] px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/30"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </section>
    </div>
  );
}
