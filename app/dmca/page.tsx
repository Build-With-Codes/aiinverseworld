import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { RelatedPolicies } from "@/components/related-policies";
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
        <p className="text-base leading-8 text-text-secondary">
          Copyright owners or authorized agents may submit a notice identifying the
          protected work, the allegedly infringing material, its location on the
          platform, and sufficient contact information for review.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Counter-notices</h2>
        <p className="text-base leading-8 text-text-secondary">
          If content is removed in error, affected parties may submit a legally valid
          counter-notice where permitted by law.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Review process</h2>
        <p className="text-base leading-8 text-text-secondary">
          Upon receiving a valid notice, we review the claim and may remove or disable
          access to the material identified while the matter is resolved. We aim to
          acknowledge valid notices promptly and act in good faith throughout the
          process.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Repeat infringers</h2>
        <p className="text-base leading-8 text-text-secondary">
          Accounts responsible for repeated, substantiated infringement may have
          submission privileges restricted or removed, consistent with our{" "}
          <Link href="/terms" className="text-brand-cyan-strong hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Contact for notices</h2>
        <p className="text-base leading-8 text-text-secondary">
          Send infringement notices and related legal correspondence to
          legal@aiverseworld.com, or use our{" "}
          <Link href="/contact" className="text-brand-cyan-strong hover:underline">
            Contact page
          </Link>
          . For general ownership questions, see our{" "}
          <Link href="/copyright" className="text-brand-cyan-strong hover:underline">
            Copyright Policy
          </Link>
          .
        </p>
      </div>
      <RelatedPolicies exclude="/dmca" />
    </ContentPage>
  );
}
