import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { RelatedPolicies } from "@/components/related-policies";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer | AiverseWorld",
  description:
    "Read important disclaimers regarding accuracy, availability, and third-party software information on AiverseWorld.",
  alternates: { canonical: buildUrl("/disclaimer") },
};

export default function DisclaimerPage() {
  return (
    <ContentPage
      eyebrow="Disclaimer"
      title="Disclaimer"
      description="AiverseWorld provides software discovery information for general business evaluation purposes."
      theme="legal"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Information accuracy</h2>
        <p className="text-base leading-8 text-text-secondary">
          Tool descriptions, pricing, features, ratings, and availability may change
          over time. Users should independently verify details with the vendor before
          relying on them for purchasing or compliance decisions.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">No professional advice</h2>
        <p className="text-base leading-8 text-text-secondary">
          Content on the platform does not constitute legal, financial, security, or
          procurement advice. Businesses should perform their own diligence based on
          internal risk, security, and compliance requirements.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Third-party brands</h2>
        <p className="text-base leading-8 text-text-secondary">
          Product names, logos, trademarks, and service marks appearing on the
          platform remain the property of their respective owners. Our use of these
          marks is descriptive, for comparison purposes, and does not imply
          endorsement. See our{" "}
          <Link href="/copyright" className="text-brand-cyan-strong hover:underline">
            Copyright Policy
          </Link>{" "}
          for more on how we handle third-party material.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Sponsored and affiliate content</h2>
        <p className="text-base leading-8 text-text-secondary">
          Some listings or links may be sponsored or generate referral compensation.
          This does not change our editorial approach to accuracy, but it is disclosed
          in full in our{" "}
          <Link href="/advertising-disclosure" className="text-brand-cyan-strong hover:underline">
            Advertising Disclosure
          </Link>{" "}
          and{" "}
          <Link href="/affiliate-disclosure" className="text-brand-cyan-strong hover:underline">
            Affiliate Disclosure
          </Link>
          .
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Limitation of liability</h2>
        <p className="text-base leading-8 text-text-secondary">
          AiverseWorld is provided on an "as is" and "as available" basis. To the
          extent permitted by law, we disclaim liability for decisions made based on
          information found on the platform. Full liability terms are set out in our{" "}
          <Link href="/terms" className="text-brand-cyan-strong hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>
      <RelatedPolicies exclude="/disclaimer" />
    </ContentPage>
  );
}
