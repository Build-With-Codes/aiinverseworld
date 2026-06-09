import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best AI Coding Tools & Assistants 2026 | AiverseWorld",
  description: "Top AI coding assistants for developers in 2026. Compare Cursor, Codeium, Lovable, and more. Find the best AI tool for your development workflow.",
  alternates: { canonical: buildUrl("/best/best-ai-coding-assistants") },
};

export default function AICodingToolsPage() {
  redirect("/best/best-ai-coding-assistants");
}
