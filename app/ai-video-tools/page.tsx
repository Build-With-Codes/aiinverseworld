import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Best AI Video Generators 2026 | AiverseWorld",
  description: "Top AI video generation tools for creators and marketers in 2026. Compare Runway, Synthesia, HeyGen, Kling AI, and more.",
  alternates: { canonical: buildUrl("/best/best-ai-video-generators") },
};

export default function AIVideoToolsPage() {
  redirect("/best/best-ai-video-generators");
}
