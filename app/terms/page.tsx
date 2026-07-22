import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service | AiverseWorld",
  description: "Review the terms that govern access to and use of AiverseWorld.",
  alternates: { canonical: buildUrl("/terms") },
};

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
        <p className="text-base leading-8 text-slate-300">
          You may use the platform only in accordance with applicable laws, these
          terms, and any enterprise agreement executed with AiverseWorld.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">User content</h2>
        <p className="text-base leading-8 text-slate-300">
          Reviews, submissions, comments, and uploads must be accurate, lawful, and
          non-infringing. We may moderate or remove content that violates policy or
          creates legal or operational risk.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Service availability</h2>
        <p className="text-base leading-8 text-slate-300">
          We aim for reliable service but do not guarantee uninterrupted access.
          Features may change as the platform evolves.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Limitation of liability</h2>
        <p className="text-base leading-8 text-slate-300">
          To the extent permitted by law, AiverseWorld is not liable for indirect,
          incidental, or consequential damages arising from platform use.
        </p>
      </div>
    </ContentPage>
  );
}
