import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FAQAccordion, type FAQItem } from "@/components/ui/faq-accordion";
import { SectionHeading } from "@/components/section-heading";
import { StructuredDataScript } from "@/components/structured-data-script";
import { cardClass } from "@/components/ui/card";
import { RelatedPolicies } from "@/components/related-policies";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ | AiverseWorld",
  description:
    "Answers to common questions about browsing, comparing, saving, and reviewing AI tools on AiverseWorld, plus how the catalog is ranked and monetized.",
  alternates: { canonical: buildUrl("/faq") },
  openGraph: {
    title: "AiverseWorld FAQ",
    description: "Common questions about how AiverseWorld works, answered.",
    url: buildUrl("/faq"),
    type: "website",
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "AiverseWorld FAQ",
    description: "Common questions about how AiverseWorld works, answered.",
    images: [defaultOpenGraphImage.url],
  },
};

const faqs: FAQItem[] = [
  {
    question: "Is AiverseWorld free to use?",
    answer:
      "Yes. Browsing the catalog, reading reviews and comparisons, saving tools, and using the compare tool are all free. AiverseWorld Premium adds an ad-free experience, unlimited saves and comparisons, and a weekly personalized digest for people who evaluate AI tools often — see the Premium page for details.",
  },
  {
    question: "How are AI tools ranked and rated?",
    answer:
      "Category rankings are driven by real engagement — views, saves, comparisons, and searches — recomputed on a schedule, not manual ordering. Ratings shown on a tool's page come from verified user reviews submitted through AiverseWorld, aggregated into an average and a rating distribution.",
  },
  {
    question: "Can I submit a review for a tool?",
    answer:
      "Yes. Sign in on any tool page to leave a star rating and written review. Reviews are tied to your account, can be edited or removed by you at any time, and are moderated to remove spam or abusive content.",
  },
  {
    question: "How do I save tools for later?",
    answer:
      "Click the bookmark icon on any tool card or tool page. Saved tools sync to your account and are available from the Saved page on any device you sign in from.",
  },
  {
    question: "How do I compare two or more tools?",
    answer:
      "Use the Compare page to search for and select any two tools, or add several tools to your compare tray from their cards and open the tray to see them side by side across pricing, features, platforms, and technical details.",
  },
  {
    question: "Does AiverseWorld accept sponsored listings or affiliate links?",
    answer:
      "Some placements may be sponsored, and some outbound links may be affiliate links that generate a referral fee. Both are disclosed in full — see the Advertising Disclosure and Affiliate Disclosure pages — and neither changes how a tool is described or rated.",
  },
  {
    question: "How often is the catalog updated?",
    answer:
      "Tool listings are reviewed and re-verified on an ongoing basis; each tool page shows a \"last verified\" date. Pricing and features can change on the vendor's side between verifications, so always confirm current details directly with the vendor before purchasing.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "We collect only what's needed to run accounts, saved tools, and reviews, and apply access controls, encryption in transit, and monitoring to protect it. Full detail is in the Privacy Policy and Security overview.",
  },
  {
    question: "How do I request account or data changes?",
    answer:
      "Reach out through the Contact page for access, correction, deletion, or export requests for your personal data, subject to applicable law.",
  },
];

export default function FaqPage() {
  return (
    <div className="space-y-10 pb-10 pt-10">
      <StructuredDataScript
        id="faq-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <div>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      </div>

      <section className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <SectionHeading
          eyebrow="Support"
          title="Frequently asked questions"
          description="Common questions about browsing, comparing, saving, and reviewing AI tools on AiverseWorld."
        />
      </section>

      <FAQAccordion items={faqs} />

      <section className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <p className="text-body text-text-secondary">
          Didn&rsquo;t find what you were looking for? Visit{" "}
          <Link href="/contact" className="text-brand-cyan-strong hover:underline">
            Contact
          </Link>{" "}
          or browse the{" "}
          <Link href="/category" className="text-brand-cyan-strong hover:underline">
            category directory
          </Link>
          .
        </p>
        <RelatedPolicies exclude="/faq" />
      </section>
    </div>
  );
}
