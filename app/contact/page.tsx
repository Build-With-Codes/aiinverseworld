import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";
import { SocialLink } from "@/components/social-link";
import { buildUrl } from "@/lib/seo";
import { socialLinks } from "@/lib/social-links";

export const metadata: Metadata = {
  title: "Contact | AiverseWorld",
  description:
    "Get in touch with AiverseWorld for enterprise partnerships, support, and legal requests.",
  alternates: { canonical: buildUrl("/contact") },
};

export default function ContactPage() {
  return (
    <ContentPage
      eyebrow="Contact"
      title="Contact Us"
      description="For support, legal inquiries, partnership discussions, or enterprise onboarding, use the channels below."
      theme="contact"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-card border border-border-subtle bg-surface-1 p-6">
          <h2 className="text-2xl font-semibold text-white">Support</h2>
          <p className="mt-3 text-base leading-8 text-text-secondary">
            support@aiverseworld.com
          </p>
        </div>
        <div className="rounded-card border border-border-subtle bg-surface-1 p-6">
          <h2 className="text-2xl font-semibold text-white">Enterprise Sales</h2>
          <p className="mt-3 text-base leading-8 text-text-secondary">
            sales@aiverseworld.com
          </p>
        </div>
        <div className="rounded-card border border-border-subtle bg-surface-1 p-6">
          <h2 className="text-2xl font-semibold text-white">Security</h2>
          <p className="mt-3 text-base leading-8 text-text-secondary">
            support@aiverseworld.com
          </p>
        </div>
        <div className="rounded-card border border-border-subtle bg-surface-1 p-6">
          <h2 className="text-2xl font-semibold text-white">Legal</h2>
          <p className="mt-3 text-base leading-8 text-text-secondary">
            legal@aiverseworld.com
          </p>
        </div>
        <div className="rounded-card border border-border-subtle bg-surface-1 p-6 md:col-span-2">
          <h2 className="text-2xl font-semibold text-white">Social</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <SocialLink
                key={link.name}
                href={link.href}
                name={link.name}
                label={link.label}
              />
            ))}
          </div>
        </div>
      </div>
    </ContentPage>
  );
}
