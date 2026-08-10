import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/app/(site)/prompt-tools/components/ToolLayout";
import { getPromptTool } from "@/lib/prompt-tools";

const tool = getPromptTool("cost-calculator");

export const metadata: Metadata = {
  title: "AI Cost Calculator | Free Prompt Tool",
  description: "Estimate AI API costs from tokens, model pricing, and request volume.",
  alternates: { canonical: "/prompt-tools/cost-calculator" },
};

export default function CostCalculatorPage() {
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
