import type { Metadata } from "next";

import { JobsClient } from "@/app/(site)/jobs/jobs-client";
import { searchJobs } from "@/lib/jobs-api";
import { buildMetadata, buildNoIndexMetadata } from "@/lib/seo/metadata";
import { getJobsSeo } from "@/services/seo.service";

export async function generateMetadata(): Promise<Metadata> {
  // The results grid is entirely client-fetched, so this is the only place
  // that can know whether the page has real content before it's indexed.
  const { meta } = await searchJobs({ limit: 1 }, { timeoutMs: 4000 });
  if (meta.total === 0) return buildNoIndexMetadata("AI Jobs | AiverseWorld");

  return buildMetadata(await getJobsSeo());
}

export default function JobsPage() {
  return <JobsClient />;
}
