import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(getRouteSeo("/best-ai-tools"));

export default function BestAIToolsPage() {
  redirect("/best/best-ai-tools-2026");
}
