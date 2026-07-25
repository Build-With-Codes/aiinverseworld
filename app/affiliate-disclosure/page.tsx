import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { RelatedPolicies } from "@/components/related-policies";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | AiverseWorld",
  description:
    "Review how affiliate links may be used on AiverseWorld and how those relationships are disclosed.",
  alternates: { canonical: buildUrl("/affiliate-disclosure") },
};

export default function AffiliateDisclosurePage() {
  return (
    <ContentPage
      eyebrow="Affiliate"
      title="Affiliate Disclosure"
      description="Some outbound links may generate referral fees or commissions if users purchase products or sign up through those links."
      theme="monetization"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How affiliate links work</h2>
        <p className="text-base leading-8 text-text-secondary">
          AiverseWorld may participate in affiliate programs with software vendors or
          marketplaces. When eligible, we may receive compensation from tracked
          referrals or completed purchases.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Disclosure approach</h2>
        <p className="text-base leading-8 text-text-secondary">
          Affiliate relationships should be disclosed clearly near relevant content or
          link destinations, especially when recommendations could influence user
          decision-making.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Which links are affiliate links</h2>
        <p className="text-base leading-8 text-text-secondary">
          Not every outbound link on AiverseWorld is an affiliate link. Where a
          commercial relationship exists, it applies to the referral link itself
          rather than to our review or comparison content, which is written the same
          way regardless of affiliate status.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Editorial integrity</h2>
        <p className="text-base leading-8 text-text-secondary">
          Compensation does not remove the need for accurate descriptions, responsible
          disclosures, and a fair presentation of alternatives. Our broader approach to
          sponsored content is described in the{" "}
          <Link href="/advertising-disclosure" className="text-brand-cyan-strong hover:underline">
            Advertising Disclosure
          </Link>
          .
        </p>
      </div>
      <RelatedPolicies exclude="/affiliate-disclosure" />
    </ContentPage>
  );
}
