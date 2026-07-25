import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { RelatedPolicies } from "@/components/related-policies";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AiverseWorld Privacy & Data Protection Policy",
  description:
    "Review how AiverseWorld collects, uses, stores, protects, and manages personal data across accounts, analytics, reviews, support, and platform services.",
  alternates: { canonical: buildUrl("/privacy") },
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
        <p className="text-base leading-8 text-text-secondary">
          We may collect account details, contact information, saved preferences,
          usage analytics, review submissions, and support messages. For enterprise
          accounts, we may also process team and workspace metadata required to
          provide the service.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How we use information</h2>
        <p className="text-base leading-8 text-text-secondary">
          We use collected data to operate the platform, personalize discovery,
          secure accounts, improve search quality, communicate product updates, and
          comply with legal obligations.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Advertising and analytics partners</h2>
        <p className="text-base leading-8 text-text-secondary">
          If we enable advertising, sponsored placements, remarketing, or conversion
          tracking, approved partners may process limited technical identifiers and
          usage data in accordance with their services, our contracts, and applicable
          privacy laws. Cookie-level detail on these partners is covered in our{" "}
          <Link href="/cookie-policy" className="text-brand-cyan-strong hover:underline">
            Cookie Policy
          </Link>
          , and paid placement rules are covered in our{" "}
          <Link href="/advertising-disclosure" className="text-brand-cyan-strong hover:underline">
            Advertising Disclosure
          </Link>
          .
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Data protection</h2>
        <p className="text-base leading-8 text-text-secondary">
          We apply technical and organizational safeguards such as access controls,
          encryption in transit, logging, monitoring, and vendor risk reviews.
          Retention periods are limited to business and compliance needs. See our{" "}
          <Link href="/security" className="text-brand-cyan-strong hover:underline">
            Security overview
          </Link>{" "}
          for more on how these controls are implemented.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Data retention</h2>
        <p className="text-base leading-8 text-text-secondary">
          We retain personal data only as long as needed to provide the service, meet
          legal and accounting obligations, resolve disputes, and enforce agreements.
          Account data is generally deleted or anonymized within a reasonable period
          after account closure, unless a longer retention period is required by law.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Children's privacy</h2>
        <p className="text-base leading-8 text-text-secondary">
          AiverseWorld is intended for business and professional use and is not
          directed at children. We do not knowingly collect personal data from
          children, and we will delete such data if we become aware it has been
          collected in error.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Your choices</h2>
        <p className="text-base leading-8 text-text-secondary">
          Users may request access, correction, deletion, or export of eligible
          personal data, subject to local law and contractual obligations. Submit
          requests through our{" "}
          <Link href="/contact" className="text-brand-cyan-strong hover:underline">
            Contact page
          </Link>
          .
        </p>
      </div>
      <RelatedPolicies exclude="/privacy" />
    </ContentPage>
  );
}
