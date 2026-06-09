import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Privacy Policy | AiverseWorld",
  description:
    "Review how AiverseWorld collects, uses, stores, and protects information.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Privacy"
      title="Privacy Policy"
      description="This page explains how AiverseWorld handles personal information and platform usage data."
      theme="privacy"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Information we collect</h2>
        <p className="text-base leading-8 text-slate-300">
          We may collect account details, contact information, saved preferences,
          usage analytics, review submissions, and support messages. For enterprise
          accounts, we may also process team and workspace metadata required to
          provide the service.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How we use information</h2>
        <p className="text-base leading-8 text-slate-300">
          We use collected data to operate the platform, personalize discovery,
          secure accounts, improve search quality, communicate product updates, and
          comply with legal obligations.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Advertising and analytics partners</h2>
        <p className="text-base leading-8 text-slate-300">
          If we enable advertising, sponsored placements, remarketing, or conversion
          tracking, approved partners may process limited technical identifiers and
          usage data in accordance with their services, our contracts, and applicable
          privacy laws.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Data protection</h2>
        <p className="text-base leading-8 text-slate-300">
          We apply technical and organizational safeguards such as access controls,
          encryption in transit, logging, monitoring, and vendor risk reviews.
          Retention periods are limited to business and compliance needs.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Your choices</h2>
        <p className="text-base leading-8 text-slate-300">
          Users may request access, correction, deletion, or export of eligible
          personal data, subject to local law and contractual obligations.
        </p>
      </div>
    </ContentPage>
  );
}
