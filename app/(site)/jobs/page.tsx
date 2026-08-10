import type { Metadata } from "next";

import { JobsClient } from "@/app/(site)/jobs/jobs-client";
import { buildMetadata } from "@/lib/seo/metadata";
import { getJobsSeo } from "@/services/seo.service";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getJobsSeo());
}

export default function JobsPage() {
  return <JobsClient />;
}
