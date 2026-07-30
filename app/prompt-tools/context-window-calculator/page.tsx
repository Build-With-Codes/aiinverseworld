import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/app/prompt-tools/components/ToolLayout";
import { getPromptTool } from "@/lib/prompt-tools";

const tool = getPromptTool("context-window-calculator");

export const metadata: Metadata = {
  title: "Context Window Calculator | Free AI Prompt Tool",
  description: "Check whether a prompt, documents, and expected output fit inside an AI model context window.",
  alternates: { canonical: "/prompt-tools/context-window-calculator" },
};

export default function ContextWindowCalculatorPage() {
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
