import type { Metadata } from "next";

import { JobsClient } from "@/app/jobs/jobs-client";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Jobs | AiverseWorld",
  description:
    "Search live AI, ML, data science, LLM, and automation roles from employer-backed job feeds.",
  alternates: {
    canonical: buildUrl("/jobs"),
  },
  openGraph: {
    title: "AI Jobs | AiverseWorld",
    description:
      "Search live AI, ML, data science, LLM, and automation roles from employer-backed job feeds.",
    url: buildUrl("/jobs"),
    type: "website",
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Jobs | AiverseWorld",
    description:
      "Search live AI, ML, data science, LLM, and automation roles from employer-backed job feeds.",
    images: [defaultOpenGraphImage.url],
  },
};

export default function JobsPage() {
  return <JobsClient />;
}
