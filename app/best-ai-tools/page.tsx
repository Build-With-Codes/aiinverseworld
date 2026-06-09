import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best AI Tools 2026 — Top Rated & Reviewed | AiverseWorld",
  description: "Discover the best AI tools in 2026 for productivity, coding, writing, video, marketing, and business. Compare 100+ tools with real pricing and user reviews.",
  alternates: { canonical: buildUrl("/best/best-ai-tools-2026") },
};

export default function BestAIToolsPage() {
  redirect("/best/best-ai-tools-2026");
}
