import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "DMCA Policy | AiverseWorld",
  description:
    "Learn how to submit copyright infringement notices and counter-notices to AiverseWorld.",
  alternates: { canonical: buildUrl("/dmca") },
};

export default function DmcaPage() {
  return (
    <ContentPage
      eyebrow="DMCA"
      title="DMCA Policy"
      description="AiverseWorld respects intellectual property rights and responds to valid copyright notices."
      theme="legal"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Submitting a notice</h2>
        <p className="text-base leading-8 text-slate-300">
          Copyright owners or authorized agents may submit a notice identifying the
          protected work, the allegedly infringing material, its location on the
          platform, and sufficient contact information for review.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Counter-notices</h2>
        <p className="text-base leading-8 text-slate-300">
          If content is removed in error, affected parties may submit a legally valid
          counter-notice where permitted by law.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Contact for notices</h2>
        <p className="text-base leading-8 text-slate-300">
          Send infringement notices and related legal correspondence to
          legal@aiverseworld.com.
        </p>
      </div>
    </ContentPage>
  );
}
