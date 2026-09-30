import type { Metadata } from "next";
import { PromptsClient } from "./prompts-client";
import { searchPrompts } from "@/lib/prompts-api";
import { buildMetadata, buildNoIndexMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";

export async function generateMetadata(): Promise<Metadata> {
  // Prompts are entirely client-fetched, so this is the only place that can
  // know whether the workspace has real content before it's indexed.
  const { meta } = await searchPrompts({ tab: "featured", limit: 1 }, { timeoutMs: 4000 });
  if (meta.total === 0) return buildNoIndexMetadata("AI Prompt Workspace | AiverseWorld");

  return buildMetadata(getRouteSeo("/prompts"));
}

export default function PromptsPage() {
  return <PromptsClient />;
}
