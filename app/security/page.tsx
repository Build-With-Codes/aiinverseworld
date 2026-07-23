import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
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
        <h2 className="text-2xl font-semibold text-white">Responsible disclosure</h2>
        <p className="text-base leading-8 text-text-secondary">
          Security researchers can report suspected vulnerabilities through our
          contact channel. We review submissions promptly and coordinate fixes when
          issues are confirmed.
        </p>
      </div>
    </ContentPage>
  );
}
