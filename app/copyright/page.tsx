import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Copyright Policy | AiverseWorld",
  description:
    "Review AiverseWorld's copyright ownership, usage rules, and infringement reporting process.",
};

export default function CopyrightPage() {
  return (
    <ContentPage
      eyebrow="Copyright"
      title="Copyright Policy"
      description="This page explains ownership of platform content and how copyright complaints are handled."
      theme="legal"
      highlights={["IP ownership", "Permitted use", "Notice process"]}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Ownership</h2>
        <p className="text-base leading-8 text-slate-300">
          Unless otherwise stated, the AiverseWorld website, platform design,
          original copy, indexes, graphics, and proprietary data arrangements are
          owned by AiverseWorld and protected by applicable intellectual property
          laws.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Permitted use</h2>
        <p className="text-base leading-8 text-slate-300">
          Users may access platform content for internal evaluation and lawful
          business use. Reproduction, redistribution, scraping at scale, or
          commercial republication requires written permission.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Infringement notices</h2>
        <p className="text-base leading-8 text-slate-300">
          If you believe content on the platform infringes your rights, please send
          a detailed notice including ownership information, the infringing material,
          and your contact details for review.
        </p>
      </div>
    </ContentPage>
  );
}
