import type { Metadata } from "next";
import { PromptsClient } from "./prompts-client";
import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";

export const metadata: Metadata = buildMetadata(getRouteSeo("/prompts"));

export default function PromptsPage() {
  return <PromptsClient />;
}
