import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/app/prompt-tools/components/ToolLayout";
import { getPromptTool } from "@/lib/prompt-tools";

const tool = getPromptTool("template-builder");

export const metadata: Metadata = {
  title: "Prompt Template Builder | Free AI Prompt Tool",
  description: "Create reusable AI prompt templates with variables, audience, constraints, and acceptance criteria.",
  alternates: { canonical: "/prompt-tools/template-builder" },
};

export default function TemplateBuilderPage() {
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
