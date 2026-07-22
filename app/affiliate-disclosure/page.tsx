import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
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
        <p className="text-base leading-8 text-slate-300">
          AiverseWorld may participate in affiliate programs with software vendors or
          marketplaces. When eligible, we may receive compensation from tracked
          referrals or completed purchases.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Disclosure approach</h2>
        <p className="text-base leading-8 text-slate-300">
          Affiliate relationships should be disclosed clearly near relevant content or
          link destinations, especially when recommendations could influence user
          decision-making.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Editorial integrity</h2>
        <p className="text-base leading-8 text-slate-300">
          Compensation does not remove the need for accurate descriptions, responsible
          disclosures, and a fair presentation of alternatives.
        </p>
      </div>
    </ContentPage>
  );
}
