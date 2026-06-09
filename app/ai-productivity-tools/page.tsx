import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best AI Productivity Tools 2026 | AiverseWorld",
  description: "Top AI productivity tools for writing, meetings, automation, and note-taking. Boost your workflow with the best AI assistants in 2026.",
  alternates: { canonical: buildUrl("/best/best-ai-productivity-tools") },
};

export default function AIProductivityToolsPage() {
  redirect("/best/best-ai-productivity-tools");
}
