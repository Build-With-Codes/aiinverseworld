import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { RelatedPolicies } from "@/components/related-policies";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cookie Policy | AiverseWorld",
  description:
    "Learn how AiverseWorld uses cookies, analytics, advertising scripts, Google AdSense, tracking technologies, and consent controls.",
  alternates: { canonical: buildUrl("/cookie-policy") },
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
        <p className="text-base leading-8 text-text-secondary">
          Cookies help us keep users signed in, remember preferences, measure site
          performance, understand traffic patterns, and support product analytics.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Types of cookies we use</h2>
        <p className="text-base leading-8 text-text-secondary">
          <strong className="text-text-primary">Essential cookies</strong> keep core
          functionality working, such as staying signed in and remembering your saved
          tools. <strong className="text-text-primary">Analytics cookies</strong> help
          us understand traffic and usage patterns.{" "}
          <strong className="text-text-primary">Advertising cookies</strong>, where
          enabled, support ad delivery and measurement as described below.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Advertising and personalization</h2>
        <p className="text-base leading-8 text-text-secondary">
          AiverseWorld may load advertising and tracking scripts from approved
          third-party partners, including Google AdSense where enabled. These
          partners may use cookies, device identifiers, or similar technologies to
          measure ad performance, limit repeated ads, prevent fraud, and personalize
          advertising where legally permitted and consented. See our{" "}
          <Link href="/advertising-disclosure" className="text-brand-cyan-strong hover:underline">
            Advertising Disclosure
          </Link>{" "}
          for how sponsored content is labeled.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">User controls</h2>
        <p className="text-base leading-8 text-text-secondary">
          Users can manage cookie choices through browser settings and, where
          applicable, our consent banner or preferences center for non-essential
          cookies. Declining non-essential cookies does not affect access to core
          platform features. Our full approach to personal data is covered in the{" "}
          <Link href="/privacy" className="text-brand-cyan-strong hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <RelatedPolicies exclude="/cookie-policy" />
    </ContentPage>
  );
}
