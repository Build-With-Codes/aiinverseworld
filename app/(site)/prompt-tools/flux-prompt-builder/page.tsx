import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/app/(site)/prompt-tools/components/ToolLayout";
import { getPromptTool } from "@/lib/prompt-tools";

const tool = getPromptTool("flux-prompt-builder");

export const metadata: Metadata = {
  title: "FLUX Prompt Builder | Free AI Prompt Tool",
  description: "Create precise FLUX image prompts with direct visual language, composition, and negative prompts.",
  alternates: { canonical: "/prompt-tools/flux-prompt-builder" },
};

export default function FluxPromptBuilderPage() {
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
