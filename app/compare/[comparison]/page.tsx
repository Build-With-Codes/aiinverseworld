import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComparisonTable } from "@/components/comparison-table";
import { SectionHeading } from "@/components/section-heading";
import { buildUrl } from "@/lib/seo";
import { getComparisonWithTools, getToolOptions } from "@/lib/tool-catalog";
import { CompareSelector } from "../compare-selector";

type ComparePageProps = {
  params: Promise<{ comparison: string }>;
};

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { comparison } = await params;
  const pair = await getComparisonWithTools(comparison);

  if (!pair) return { title: "Comparison not found | AiverseWorld" };

  return {
    title: `${pair.left.name} vs ${pair.right.name} | AiverseWorld`,
    description: `Compare ${pair.left.name} and ${pair.right.name} across category, pricing, platforms, and use cases.`,
    alternates: { canonical: buildUrl(`/compare/${comparison}`) },
  };
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { comparison } = await params;
  const [pair, toolOptions] = await Promise.all([
    getComparisonWithTools(comparison),
    getToolOptions(),
  ]);

  if (!pair) notFound();

  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Compare"
          title={`${pair.left.name} vs ${pair.right.name}`}
          description="A direct comparison using the real catalog fields currently available for both products."
        />
        <CompareSelector
          currentLeft={pair.left.id}
          currentRight={pair.right.id}
          toolOptions={toolOptions}
        />
      </section>

      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <ComparisonTable left={pair.left} right={pair.right} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-2xl font-semibold text-white">{pair.left.name} best for</h2>
          <div className="mt-5 space-y-3">
            {pair.left.bestFor.map((item) => (
              <div key={item} className="rounded-2xl border border-emerald-300/15 bg-emerald-300/8 px-4 py-3 text-sm text-emerald-100">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-2xl font-semibold text-white">{pair.right.name} best for</h2>
          <div className="mt-5 space-y-3">
            {pair.right.bestFor.map((item) => (
              <div key={item} className="rounded-2xl border border-emerald-300/15 bg-emerald-300/8 px-4 py-3 text-sm text-emerald-100">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
