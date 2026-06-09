import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best AI Writing Tools & Software 2026 | AiverseWorld",
  description: "The top AI writing tools for content creation, copywriting, grammar, and paraphrasing. Compare Grammarly, Jasper, Copy.ai, and more.",
  alternates: { canonical: buildUrl("/best/best-ai-writing-tools") },
};

export default function AIWritingToolsPage() {
  redirect("/best/best-ai-writing-tools");
}
