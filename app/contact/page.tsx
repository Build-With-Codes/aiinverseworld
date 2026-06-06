import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Contact | AiverseWorld",
  description:
    "Get in touch with AiverseWorld for enterprise partnerships, support, and legal requests.",
};

export default function ContactPage() {
  return (
    <ContentPage
      eyebrow="Contact"
      title="Contact Us"
      description="For support, legal inquiries, partnership discussions, or enterprise onboarding, use the channels below."
      theme="contact"
      highlights={["Support", "Enterprise sales", "Security", "Legal"]}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[24px] border border-white/10 bg-[#081222] p-6">
          <h2 className="text-2xl font-semibold text-white">Support</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            support@aiverseworld.com
          </p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#081222] p-6">
          <h2 className="text-2xl font-semibold text-white">Enterprise Sales</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            sales@aiverseworld.com
          </p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#081222] p-6">
          <h2 className="text-2xl font-semibold text-white">Security</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            support@aiverseworld.com
          </p>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-[#081222] p-6">
          <h2 className="text-2xl font-semibold text-white">Legal</h2>
          <p className="mt-3 text-base leading-8 text-slate-300">
            legal@aiverseworld.com
          </p>
        </div>
      </div>
    </ContentPage>
  );
}
