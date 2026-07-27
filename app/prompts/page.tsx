import type { Metadata } from "next";
import { PromptsClient } from "./prompts-client";

export const metadata: Metadata = {
  title: "AI Prompt Workspace | Search, Copy & Save Prompts",
  description:
    "Discover production-ready AI prompts for GPT, Claude, Gemini, Llama, DeepSeek, and Qwen with search, filters, quality scores, and variable previews.",
  alternates: { canonical: "/prompts" },
  openGraph: {
    title: "AI Prompt Workspace | AiverseWorld",
    description:
      "Search, customize, copy, and save production-ready AI prompts for marketing, coding, business, agents, design, and education.",
    url: "/prompts",
    type: "website",
  },
};

export default function PromptsPage() {
  return <PromptsClient />;
}
