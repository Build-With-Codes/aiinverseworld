import { getComparisonByIds, getComparisons, getToolOptions } from "@/lib/tool-catalog";
import { CompareClient } from "./compare-client";

type ComparePageProps = {
  searchParams: Promise<{ leftId?: string; rightId?: string }>;
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { leftId, rightId } = await searchParams;
  const [comparisonResult, toolOptions, selectedPair] = await Promise.all([
    getComparisons(120),
    getToolOptions(),
    leftId && rightId ? getComparisonByIds(leftId, rightId) : null,
  ]);

  return (
    <CompareClient
      comparisons={comparisonResult.comparisons}
      toolOptions={toolOptions}
      selectedPair={selectedPair ? { left: selectedPair.left, right: selectedPair.right } : null}
    />
  );
}
