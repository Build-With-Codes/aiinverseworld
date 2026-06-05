import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComparisonTable } from "@/components/comparison-table";
import { SectionHeading } from "@/components/section-heading";
import { getComparisonTools } from "@/lib/site-data";

type ComparePageProps = {
  params: Promise<{ comparison: string }>;
};

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const { comparison } = await params;
  const pair = getComparisonTools(comparison);

  if (!pair) {
    return {
      title: "Comparison not found | AiverseWorld",
    };
  }

  return {
    title: `${pair.left.name} vs ${pair.right.name} | AiverseWorld`,
    description: `Compare ${pair.left.name} and ${pair.right.name} across category, description, website, and use cases.`,
  };
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { comparison } = await params;
  const pair = getComparisonTools(comparison);

  if (!pair) {
    notFound();
  }

  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Compare"
          title={`${pair.left.name} vs ${pair.right.name}`}
          description="A direct comparison using the real catalog fields currently available for both products."
        />
        <ComparisonTable left={pair.left} right={pair.right} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-2xl font-semibold text-white">{pair.left.name} use cases</h2>
          <div className="mt-5 space-y-3">
            {pair.left.useCases.map((useCase) => (
              <div key={useCase} className="rounded-2xl border border-emerald-300/15 bg-emerald-300/8 px-4 py-3 text-sm text-emerald-100">
                {useCase}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-2xl font-semibold text-white">{pair.right.name} use cases</h2>
          <div className="mt-5 space-y-3">
            {pair.right.useCases.map((useCase) => (
              <div key={useCase} className="rounded-2xl border border-emerald-300/15 bg-emerald-300/8 px-4 py-3 text-sm text-emerald-100">
                {useCase}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
