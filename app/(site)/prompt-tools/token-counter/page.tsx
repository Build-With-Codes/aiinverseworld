import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/app/(site)/prompt-tools/components/ToolLayout";
import { getPromptTool } from "@/lib/prompt-tools";

const tool = getPromptTool("token-counter");

export const metadata: Metadata = {
  title: "Token Counter | Free AI Prompt Tool",
  description: "Estimate prompt tokens, words, characters, and reading size in your browser.",
  alternates: { canonical: "/prompt-tools/token-counter" },
};

export default function TokenCounterPage() {
  if (!tool) notFound();
  return <ToolLayout tool={tool} />;
}
