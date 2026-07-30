import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/app/prompt-tools/components/ToolLayout";
import { getPromptTool } from "@/lib/prompt-tools";

const tool = getPromptTool("prompt-formatter");

export const metadata: Metadata = {
  title: "Prompt Formatter | Free AI Prompt Tool",
  description: "Turn rough notes into a structured AI prompt with role, context, constraints, and output format.",
  alternates: { canonical: "/prompt-tools/prompt-formatter" },
};

export default function PromptFormatterPage() {
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
