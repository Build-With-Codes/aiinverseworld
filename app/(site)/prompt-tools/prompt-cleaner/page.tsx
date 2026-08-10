import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/app/(site)/prompt-tools/components/ToolLayout";
import { getPromptTool } from "@/lib/prompt-tools";

const tool = getPromptTool("prompt-cleaner");

export const metadata: Metadata = {
  title: "Prompt Cleaner | Free AI Prompt Tool",
  description: "Clean messy prompt drafts by reducing filler, duplicate spacing, and vague phrasing.",
  alternates: { canonical: "/prompt-tools/prompt-cleaner" },
};

export default function PromptCleanerPage() {
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
