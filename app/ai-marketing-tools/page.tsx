import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best AI Marketing Tools 2026 | AiverseWorld",
  description: "Top AI tools for digital marketing — SEO, ads, content, social media, and campaign management. Compare the best AI marketing software in 2026.",
  alternates: { canonical: buildUrl("/best/best-ai-marketing-tools") },
};

export default function AIMarketingToolsPage() {
  redirect("/best/best-ai-marketing-tools");
}
