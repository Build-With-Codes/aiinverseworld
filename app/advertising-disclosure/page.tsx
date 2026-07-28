import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { RelatedPolicies } from "@/components/related-policies";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(getRouteSeo("/advertising-disclosure"));

export default function AdvertisingDisclosurePage() {
  return (
    <ContentPage
      eyebrow="Advertising"
      title="Advertising Disclosure"
      description="This page explains how sponsored content, advertising, and commercial placements are presented on AiverseWorld."
      theme="monetization"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Sponsored placements</h2>
        <p className="text-base leading-8 text-text-secondary">
          Some listings, category placements, newsletters, or comparison modules may
          be paid promotions. When this happens, the related content should be clearly
          labeled with terms such as Sponsored, Promoted, or Advertisement.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Editorial independence</h2>
        <p className="text-base leading-8 text-text-secondary">
          Commercial relationships should not be presented as neutral editorial
          rankings without disclosure. We maintain separation between sponsored
          placements and organic discovery areas wherever possible.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Programmatic advertising</h2>
        <p className="text-base leading-8 text-text-secondary">
          AiverseWorld may display programmatic ads served through networks such as
          Google AdSense. These ads are selected automatically and are separate from
          our editorial rankings and tool comparisons, which are never for sale.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Measurement and policy compliance</h2>
        <p className="text-base leading-8 text-text-secondary">
          Advertising may use analytics, click measurement, or conversion tracking in
          line with our{" "}
          <Link href="/privacy" className="text-brand-cyan-strong hover:underline">
            Privacy
          </Link>{" "}
          and{" "}
          <Link href="/cookie-policy" className="text-brand-cyan-strong hover:underline">
            Cookie
          </Link>{" "}
          policies, applicable laws, and platform advertising standards. Referral and
          commission-based placements are covered separately in our{" "}
          <Link href="/affiliate-disclosure" className="text-brand-cyan-strong hover:underline">
            Affiliate Disclosure
          </Link>
          .
        </p>
      </div>
      <RelatedPolicies exclude="/advertising-disclosure" />
    </ContentPage>
  );
}
