import type { Metadata } from "next";


import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";
import { buildUrl } from "@/lib/seo";
import { EnglishTutorClient } from "./tutor-client";

export const metadata: Metadata = buildMetadata(getRouteSeo("/english-speaking-tutor"));

export default function EnglishSpeakingTutorPage() {
  return <EnglishTutorClient />;
}
