import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { RelatedPolicies } from "@/components/related-policies";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Security | AiverseWorld",
  description:
    "Learn about the security principles and controls used by AiverseWorld.",
  alternates: { canonical: buildUrl("/security") },
};

export default function SecurityPage() {
  return (
    <ContentPage
      eyebrow="Trust"
      title="Security"
      description="Enterprise users expect clear security posture information. This page provides a concise overview."
      theme="security"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Core controls</h2>
        <p className="text-base leading-8 text-text-secondary">
          Our architecture is designed around least-privilege access, secure coding
          practices, auditability, and controlled infrastructure changes.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Data safeguards</h2>
        <p className="text-base leading-8 text-text-secondary">
          We protect data using encryption in transit, secure storage practices,
          access review processes, and continuous operational monitoring.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Account security</h2>
        <p className="text-base leading-8 text-text-secondary">
          Authentication is handled through vetted identity providers rather than
          storing passwords directly. Sessions are scoped and time-bound, and account
          data is only accessible to authorized services needed to operate the
          platform.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Responsible disclosure</h2>
        <p className="text-base leading-8 text-text-secondary">
          Security researchers can report suspected vulnerabilities through our{" "}
          <Link href="/contact" className="text-brand-cyan-strong hover:underline">
            contact channel
          </Link>
          . We review submissions promptly and coordinate fixes when issues are
          confirmed. Please report issues privately and allow reasonable time for a
          fix before public disclosure.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Data handling</h2>
        <p className="text-base leading-8 text-text-secondary">
          For details on what data we collect and how it is used, see our{" "}
          <Link href="/privacy" className="text-brand-cyan-strong hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <RelatedPolicies exclude="/security" />
    </ContentPage>
  );
}
