import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Cookie Policy | AiverseWorld",
  description:
    "Learn how AiverseWorld uses cookies, analytics technologies, and consent controls.",
};

export default function CookiePolicyPage() {
  return (
    <ContentPage
      eyebrow="Cookies"
      title="Cookie Policy"
      description="This policy explains how cookies and similar technologies are used across the AiverseWorld platform."
      theme="monetization"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">What we use cookies for</h2>
        <p className="text-base leading-8 text-slate-300">
          Cookies help us keep users signed in, remember preferences, measure site
          performance, understand traffic patterns, and support product analytics.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Advertising and personalization</h2>
        <p className="text-base leading-8 text-slate-300">
          If advertising, sponsored placements, or remarketing are enabled, cookies
          may be used by AiverseWorld and approved partners to measure campaign
          performance, cap frequency, and personalize experiences where legally
          permitted.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">User controls</h2>
        <p className="text-base leading-8 text-slate-300">
          Users can manage cookie choices through browser settings and, where
          applicable, our consent banner or preferences center for non-essential
          cookies.
        </p>
      </div>
    </ContentPage>
  );
}
