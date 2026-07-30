import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/app/prompt-tools/components/ToolLayout";
import { getPromptTool } from "@/lib/prompt-tools";

const tool = getPromptTool("midjourney-prompt-builder");

export const metadata: Metadata = {
  title: "Midjourney Prompt Builder | Free AI Prompt Tool",
  description: "Build cinematic Midjourney prompts with subject, style, composition, lighting, and aspect ratio.",
  alternates: { canonical: "/prompt-tools/midjourney-prompt-builder" },
};

export default function MidjourneyPromptBuilderPage() {
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
