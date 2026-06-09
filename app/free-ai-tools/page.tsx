import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best Free AI Tools 2026 — No Credit Card Required | AiverseWorld",
  description: "The top free AI tools in 2026. Browse 50+ AI tools with a free plan — no credit card required to get started.",
  alternates: { canonical: buildUrl("/best/free-ai-tools") },
};

export default function FreeAIToolsPage() {
  redirect("/best/free-ai-tools");
}
