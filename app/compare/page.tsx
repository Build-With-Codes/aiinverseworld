import {
  getComparisonByIds,
  getComparisons,
  getToolById,
  getToolOptions,
} from "@/lib/tool-catalog";
import type { AITool } from "@/lib/catalog-types";
import { CompareClient } from "./compare-client";

type ComparePageProps = {
  searchParams: Promise<{ leftId?: string; rightId?: string; ids?: string }>;
};

function buildRecommendation(tools: AITool[]): string {
  if (tools.length < 2) return "";

  const rated = [...tools].filter((t) => t.rating);
  const topRated = rated.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];
  const cheapest = [...tools]
    .filter((t) => t.startingPriceUsd !== null)
    .sort((a, b) => (a.startingPriceUsd ?? 0) - (b.startingPriceUsd ?? 0))[0];
  const freeOnes = tools.filter((t) => t.freePlan === "Yes").map((t) => t.name);

  const parts: string[] = [];
  if (topRated?.rating) {
    parts.push(
      `${topRated.name} leads on community rating (${topRated.rating.toFixed(1)}/5)`,
    );
  }
  if (cheapest) {
    parts.push(
      cheapest.startingPriceUsd === 0
        ? `${cheapest.name} is free to start`
        : `${cheapest.name} is the most affordable entry at $${cheapest.startingPriceUsd}/mo`,
    );
  }
  if (freeOnes.length > 0) {
    parts.push(`${freeOnes.join(" and ")} offer a free plan to trial first`);
  }

  const lead = parts.length > 0 ? `${parts.join("; ")}. ` : "";
  return `${lead}Pick based on your priority: rating and capability, price, or a free tier to evaluate before committing.`;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { leftId, rightId, ids } = await searchParams;

  const idList = ids
    ? ids.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4)
    : [];

  const [comparisonResult, toolOptions, selectedPair, multiToolsRaw] =
    await Promise.all([
      getComparisons(120),
      getToolOptions(),
      leftId && rightId ? getComparisonByIds(leftId, rightId) : null,
      idList.length >= 2
        ? Promise.all(idList.map((id) => getToolById(id)))
        : Promise.resolve([]),
    ]);

  const multiTools = multiToolsRaw.filter(
    (tool): tool is AITool => Boolean(tool),
  );

  return (
    <CompareClient
      comparisons={comparisonResult.comparisons}
      toolOptions={toolOptions}
      selectedPair={
        selectedPair
          ? { left: selectedPair.left, right: selectedPair.right }
          : null
      }
      multiTools={multiTools.length >= 2 ? multiTools : undefined}
      recommendation={multiTools.length >= 2 ? buildRecommendation(multiTools) : undefined}
    />
  );
}
