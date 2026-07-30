import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/app/prompt-tools/components/ToolLayout";
import { getPromptTool } from "@/lib/prompt-tools";

const tool = getPromptTool("system-prompt-builder");

export const metadata: Metadata = {
  title: "System Prompt Builder | Free AI Prompt Tool",
  description: "Build reliable system prompts with role, behavior rules, boundaries, and response contracts.",
  alternates: { canonical: "/prompt-tools/system-prompt-builder" },
};

export default function SystemPromptBuilderPage() {
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
