import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Advertising Disclosure | AiverseWorld",
  description:
    "Understand how AiverseWorld handles sponsored listings, paid placements, and advertising disclosures.",
};

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
        <p className="text-base leading-8 text-slate-300">
          Some listings, category placements, newsletters, or comparison modules may
          be paid promotions. When this happens, the related content should be clearly
          labeled with terms such as Sponsored, Promoted, or Advertisement.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Editorial independence</h2>
        <p className="text-base leading-8 text-slate-300">
          Commercial relationships should not be presented as neutral editorial
          rankings without disclosure. We maintain separation between sponsored
          placements and organic discovery areas wherever possible.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Measurement and policy compliance</h2>
        <p className="text-base leading-8 text-slate-300">
          Advertising may use analytics, click measurement, or conversion tracking in
          line with our privacy and cookie policies, applicable laws, and platform
          advertising standards.
        </p>
      </div>
    </ContentPage>
  );
}
