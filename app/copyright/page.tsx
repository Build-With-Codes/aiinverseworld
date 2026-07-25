import type { Metadata } from "next";
import Link from "next/link";

import { ContentPage } from "@/components/content-page";
import { RelatedPolicies } from "@/components/related-policies";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Copyright Policy | AiverseWorld",
  description:
    "Review AiverseWorld's copyright ownership, usage rules, and infringement reporting process.",
  alternates: { canonical: buildUrl("/copyright") },
};

export default function CopyrightPage() {
  return (
    <ContentPage
      eyebrow="Copyright"
      title="Copyright Policy"
      description="This page explains ownership of platform content and how copyright complaints are handled."
      theme="legal"
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Ownership</h2>
        <p className="text-base leading-8 text-text-secondary">
          Unless otherwise stated, the AiverseWorld website, platform design,
          original copy, indexes, graphics, and proprietary data arrangements are
          owned by AiverseWorld and protected by applicable intellectual property
          laws.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Permitted use</h2>
        <p className="text-base leading-8 text-text-secondary">
          Users may access platform content for internal evaluation and lawful
          business use. Reproduction, redistribution, scraping at scale, or
          commercial republication requires written permission.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Trademarks</h2>
        <p className="text-base leading-8 text-text-secondary">
          The AiverseWorld name and logo are trademarks of AiverseWorld. Third-party
          product names, logos, and trademarks referenced across the catalog belong
          to their respective owners and are used descriptively for comparison and
          discovery purposes only, as outlined in our{" "}
          <Link href="/disclaimer" className="text-brand-cyan-strong hover:underline">
            Disclaimer
          </Link>
          .
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Infringement notices</h2>
        <p className="text-base leading-8 text-text-secondary">
          If you believe content on the platform infringes your rights, please send
          a detailed notice including ownership information, the infringing material,
          and your contact details for review. Formal takedown requests should follow
          our{" "}
          <Link href="/dmca" className="text-brand-cyan-strong hover:underline">
            DMCA Policy
          </Link>
          .
        </p>
      </div>
      <RelatedPolicies exclude="/copyright" />
    </ContentPage>
  );
}
