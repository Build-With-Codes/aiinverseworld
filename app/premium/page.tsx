import type { Metadata } from "next";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { FeatureCard } from "@/components/ui/feature-card";
import { PricingCard } from "@/components/ui/pricing-card";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { cardClass } from "@/components/ui/card";
import { EditorialBlock } from "@/components/ui/editorial-block";
import { FadeInSection, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AiverseWorld Premium — Discover AI without limits",
  description:
    "Go ad-free, compare and save without limits, get saved-search alerts, members-only deep dives, and a personalized weekly AI digest. Upgrade to AiverseWorld Premium.",
  alternates: { canonical: buildUrl("/premium") },
  openGraph: {
    title: "AiverseWorld Premium",
    description:
      "Ad-free discovery, unlimited compare & saves, saved-search alerts, Pro collections, and a weekly personalized digest.",
    url: buildUrl("/premium"),
    type: "website",
    images: [defaultOpenGraphImage],
  },
};

const benefits = [
  {
    icon: "✦",
    title: "Ad-free, focused reading",
    description: "Every page, distraction-free.",
    benefit: "The cleanest way to research and decide.",
  },
  {
    icon: "⇄",
    title: "Unlimited compare & saves",
    description: "No caps on your compare tray or saved library.",
    benefit: "Evaluate as many tools as a real decision needs.",
  },
  {
    icon: "🔔",
    title: "Saved searches & alerts",
    description: "Save a filter; we tell you when a new tool matches.",
    benefit: "Never miss the tool that fits your exact need.",
  },
  {
    icon: "◆",
    title: "Pro collections & deep dives",
    description: "Members-only buying guides and long-form verdicts.",
    benefit: "Editorial depth you can't get anywhere else.",
  },
  {
    icon: "✧",
    title: "Weekly personalized digest",
    description: "The best new tools for you, once a week.",
    benefit: "Stay current in five minutes, not five hours.",
  },
  {
    icon: "↗",
    title: "Early access & export",
    description: "New tools first; export shortlists to CSV & Notion.",
    benefit: "Move from research to action without copy-paste.",
  },
];

const tierRows: { label: string; free: string; premium: string }[] = [
  { label: "Browse & search all tools", free: "Yes", premium: "Yes" },
  { label: "Read reviews & comparisons", free: "Yes", premium: "Yes" },
  { label: "Save tools", free: "Up to 10", premium: "Unlimited" },
  { label: "Compare at once", free: "Up to 3", premium: "Unlimited" },
  { label: "Ads", free: "Shown", premium: "Removed" },
  { label: "Saved searches & alerts", free: "—", premium: "Included" },
  { label: "Pro collections & deep dives", free: "—", premium: "Included" },
  { label: "Weekly personalized digest", free: "—", premium: "Included" },
  { label: "Export & early access", free: "—", premium: "Included" },
];

const faqs = [
  {
    question: "What do I get that's not free?",
    answer:
      "Everything on the site stays free to browse. Premium adds leverage on top: no ads, no limits on compare or saves, saved-search alerts, members-only editorial, a weekly personalized digest, and export. It's about doing more, faster — not unlocking basic access.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Premium is month-to-month (or save with annual). Cancel whenever you like and you keep access through the end of your billing period.",
  },
  {
    question: "Is my saved library kept if I downgrade?",
    answer:
      "Your saved tools and history are always yours. If you downgrade, everything stays — you'll just return to the free tier's generous limits for new saves and compares.",
  },
  {
    question: "Do you sell my data?",
    answer:
      "No. Premium's whole point is a cleaner, more private experience — that's why it's ad-free. Review our Privacy Policy for the full detail.",
  },
];

export default function PremiumPage() {
  return (
    <div className="space-y-12 pb-10 pt-6">
      <div className="pt-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Premium" }]} />
      </div>

      {/* Hero */}
      <FadeInSection className="relative overflow-hidden rounded-card-lg border border-border-accent bg-gradient-to-br from-brand-electric/10 via-brand-violet/8 to-transparent p-8 shadow-glow-violet sm:p-12">
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-brand-violet/20 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-2xl">
          <Badge variant="brand">AiverseWorld Premium</Badge>
          <h1 className="text-display-1 mt-5 text-text-primary">Discover AI without limits.</h1>
          <p className="text-body-lg mt-4 text-text-secondary">
            Go ad-free, compare and save as much as you want, and get members-only depth plus a
            weekly digest tuned to you. The fastest, calmest way to stay ahead of AI.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a
              href="#pricing"
              className="premium-pill premium-gradient inline-flex items-center gap-2 rounded-pill px-7 py-3.5 text-base font-semibold"
            >
              See plans
            </a>
            <span className="text-caption text-text-muted">
              7-day free trial · cancel anytime
            </span>
          </div>
        </div>
      </FadeInSection>

      {/* Benefits */}
      <div>
        <SectionHeading
          eyebrow="What you get"
          title="Built for people who evaluate a lot of AI"
          description="Free is for browsing. Premium is for deciding — with less friction and no noise."
        />
        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <FeatureCard icon={<span>{b.icon}</span>} title={b.title} description={b.description} benefit={b.benefit} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>

      {/* Pricing */}
      <div id="pricing" className="scroll-mt-6">
        <SectionHeading eyebrow="Pricing" title="Simple, honest pricing" description="Start free. Upgrade when you're doing enough to feel the limits." />
        <div className="grid gap-6 lg:grid-cols-2">
          <PricingCard
            planName="Free"
            price="Free"
            description="Everything you need to browse, search, and compare."
            features={[
              "Browse & search all tools",
              "Read every review & comparison",
              "Save up to 10 tools",
              "Compare up to 3 at once",
            ]}
            ctaLabel="You're on Free"
          />
          <PricingCard
            planName="Premium"
            price="$7"
            cadence="/mo"
            description="For people who research and decide on AI often."
            highlighted
            features={[
              "Everything in Free, with no limits",
              "Ad-free across the whole site",
              "Unlimited saves & compares",
              "Saved searches with new-match alerts",
              "Pro collections & long-form verdicts",
              "Weekly personalized digest + export",
            ]}
            ctaLabel="Start 7-day free trial"
            ctaHref="/premium#pricing"
          />
        </div>
        <p className="text-caption mt-4 text-text-muted">
          Billing isn&rsquo;t live yet — this is a preview of the Premium plan. Want in early? Join the
          waitlist from the community section on the home page.
        </p>
      </div>

      {/* Tier comparison */}
      <div>
        <SectionHeading eyebrow="Compare plans" title="Free vs Premium" />
        <div className="no-scrollbar overflow-x-auto rounded-card-lg border border-border-subtle bg-surface-2 backdrop-blur-xl">
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-px bg-border-subtle">
            <div className="bg-surface-1 p-4 text-sm font-semibold text-text-muted">Feature</div>
            <div className="bg-surface-1 p-4 text-sm font-semibold text-text-primary">Free</div>
            <div className="bg-surface-1 p-4 text-sm font-semibold text-brand-cyan-strong">Premium</div>
            {tierRows.map((row) => (
              <div key={row.label} className="contents">
                <div className="bg-surface-2 p-4 text-sm text-text-secondary">{row.label}</div>
                <div className="bg-surface-2 p-4 text-sm text-text-muted">{row.free}</div>
                <div className="bg-surface-2 p-4 text-sm font-medium text-text-primary">{row.premium}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verdict / trust */}
      <EditorialBlock eyebrow="Why Premium" title="A better room, not a locked door" tone="verdict">
        <p>
          The whole catalog stays free — that&rsquo;s the promise. Premium simply gives the people who
          live in AI a faster, quieter, more powerful place to work: no ads, no limits, and depth
          you won&rsquo;t find elsewhere. It funds the independent curation the free site runs on.
        </p>
      </EditorialBlock>

      {/* FAQ */}
      <div>
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <FAQAccordion items={faqs} />
      </div>

      {/* Final CTA */}
      <FadeInSection
        className={`${cardClass({ padding: "lg", radius: "card-lg", glow: "violet" })} flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center`}
      >
        <div>
          <h2 className="text-heading-1 text-text-primary">Ready to discover AI without limits?</h2>
          <p className="text-body mt-2 text-text-secondary">Start free, upgrade when it pays for itself.</p>
        </div>
        <a
          href="#pricing"
          className="premium-pill premium-gradient inline-flex shrink-0 items-center gap-2 rounded-pill px-7 py-3.5 text-base font-semibold"
        >
          See plans
        </a>
      </FadeInSection>
    </div>
  );
}
