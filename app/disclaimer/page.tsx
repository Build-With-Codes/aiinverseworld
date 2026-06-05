import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Disclaimer | AiverseWorld",
  description:
    "Read important disclaimers regarding accuracy, availability, and third-party software information on AiverseWorld.",
};

export default function DisclaimerPage() {
  return (
    <ContentPage
      eyebrow="Disclaimer"
      title="Disclaimer"
      description="AiverseWorld provides software discovery information for general business evaluation purposes."
      theme="legal"
      highlights={["Independent verification", "No legal advice", "Third-party trademarks"]}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Information accuracy</h2>
        <p className="text-base leading-8 text-slate-300">
          Tool descriptions, pricing, features, ratings, and availability may change
          over time. Users should independently verify details with the vendor before
          relying on them for purchasing or compliance decisions.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">No professional advice</h2>
        <p className="text-base leading-8 text-slate-300">
          Content on the platform does not constitute legal, financial, security, or
          procurement advice. Businesses should perform their own diligence based on
          internal risk, security, and compliance requirements.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Third-party brands</h2>
        <p className="text-base leading-8 text-slate-300">
          Product names, logos, trademarks, and service marks appearing on the
          platform remain the property of their respective owners.
        </p>
      </div>
    </ContentPage>
  );
}
