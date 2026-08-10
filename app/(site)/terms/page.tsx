import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { RelatedPolicies } from "@/components/related-policies";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(getRouteSeo("/terms"));

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms of Service"
      description="These terms outline the rules, responsibilities, and permitted use of the AiverseWorld platform."
      theme="legal"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Platform access</h2>
        <p className="text-base leading-8 text-text-secondary">
          You may use the platform only in accordance with applicable laws, these
          terms, and any enterprise agreement executed with AiverseWorld.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">User content</h2>
        <p className="text-base leading-8 text-text-secondary">
          Reviews, submissions, comments, and uploads must be accurate, lawful, and
          non-infringing. We may moderate or remove content that violates policy or
          creates legal or operational risk. Personal data submitted alongside content
          is handled under our{" "}
          <Link href="/privacy" className="text-brand-cyan-strong hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Service availability</h2>
        <p className="text-base leading-8 text-text-secondary">
          We aim for reliable service but do not guarantee uninterrupted access.
          Features may change as the platform evolves.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Limitation of liability</h2>
        <p className="text-base leading-8 text-text-secondary">
          To the extent permitted by law, AiverseWorld is not liable for indirect,
          incidental, or consequential damages arising from platform use. See our{" "}
          <Link href="/disclaimer" className="text-brand-cyan-strong hover:underline">
            Disclaimer
          </Link>{" "}
          for further detail on information accuracy and third-party content.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Termination</h2>
        <p className="text-base leading-8 text-text-secondary">
          We may suspend or terminate access for accounts that violate these terms,
          create security risk, or engage in abusive, fraudulent, or unlawful behavior.
          Users may stop using the platform and request account deletion at any time.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Changes to these terms</h2>
        <p className="text-base leading-8 text-text-secondary">
          We may update these terms as the platform evolves. Material changes will be
          reflected by an updated revision date on this page. Continued use of the
          platform after changes take effect constitutes acceptance of the revised
          terms.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Governing law and contact</h2>
        <p className="text-base leading-8 text-text-secondary">
          These terms are governed by applicable law in the jurisdiction where
          AiverseWorld operates, without regard to conflict-of-law principles.
          Questions about these terms can be sent through our{" "}
          <Link href="/contact" className="text-brand-cyan-strong hover:underline">
            Contact page
          </Link>
          .
        </p>
      </div>
      <RelatedPolicies exclude="/terms" />
    </ContentPage>
  );
}
