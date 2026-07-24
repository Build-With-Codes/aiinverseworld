import { FaviconBadge } from "@/components/favicon-badge";
import { StructuredDataScript } from "@/components/structured-data-script";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
import { ComparisonTable } from "@/components/comparison-table";
import { EditorialBlock } from "@/components/ui/editorial-block";
import { FAQAccordion, type FAQItem } from "@/components/ui/faq-accordion";
import { FeatureCard } from "@/components/ui/feature-card";
import { FadeInSection, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import { ReviewSection } from "@/components/ui/review-section";
import { ToolHero } from "@/components/ui/tool-hero";
import { RecentlyViewedRail } from "@/components/engagement/recently-viewed-rail";
import { ToolActionBar } from "@/components/engagement/tool-action-bar";
import { ViewTracker } from "@/components/engagement/view-tracker";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { getRelatedTools } from "@/lib/engagement";
import { getReviews } from "@/lib/reviews-api";
import { buildUrl, buildToolMeta } from "@/lib/seo";
import { getToolById, getToolBySlug, searchTools } from "@/lib/tool-catalog";
import type { AITool } from "@/lib/catalog-types";
import type { Metadata } from "next";
import Link from "next/link";

type ToolDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ id?: string }>;
};

function splitSummaryParagraphs(value?: string | null) {
  return (value ?? "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function formatList(items: string[]) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildHowItWorks(tool: AITool) {
  const modality = formatList(tool.modalities.slice(0, 2)).toLowerCase() || "text-based";
  const aiType = formatList(tool.aiType.slice(0, 2)).toLowerCase() || "AI-assisted";
  const platforms = formatList(tool.platforms.slice(0, 3)).toLowerCase() || "the web";

  return `${tool.name} runs as ${aiType} software built around ${modality} workflows. Users typically start with a prompt, upload, or connected data source, and the underlying model handles the heavy lifting before returning a result you can refine or export. It's available on ${platforms}${tool.apiAvailable ? ", with API access for teams that want to embed it into their own products" : ""}.`;
}

function buildFeatureNotes(tool: AITool) {
  if (tool.featureNotes && tool.featureNotes.length > 0) return tool.featureNotes;

  const audience = formatList(tool.bestFor.slice(0, 2)).toLowerCase() || "everyday work";

  return tool.features.slice(0, 6).map((feature) => ({
    feature,
    benefit: `Practical for ${audience} without extra setup.`,
  }));
}

function buildPros(tool: AITool) {
  if (tool.pros && tool.pros.length > 0) return tool.pros;

  const pros: string[] = [];
  if (tool.freePlan === "Yes") pros.push("Free plan available to try before you buy");
  if (tool.freePlan === "Limited") pros.push("Limited free tier for evaluating the product");
  if (tool.apiAvailable) pros.push("API access for custom integrations and automation");
  if (tool.openSource) pros.push("Open source, with full transparency into how it works");
  if (tool.teamCollaboration) pros.push("Built-in collaboration features for teams");
  if (tool.rating && tool.rating >= 4.4) pros.push(`Strongly rated by users (${tool.rating.toFixed(1)}/5)`);
  tool.features.slice(0, 2).forEach((feature) => pros.push(`Strong ${feature.toLowerCase()} capability`));

  return pros.slice(0, 5);
}

function buildCons(tool: AITool) {
  if (tool.cons && tool.cons.length > 0) return tool.cons;

  const cons: string[] = [];
  if (tool.freePlan === "No") cons.push("No free plan — pricing applies from the start");
  if (!tool.apiAvailable) cons.push("No public API for custom integrations");
  if (!tool.openSource) cons.push("Closed source, with limited visibility into internals");
  if (tool.startingPriceUsd && tool.startingPriceUsd > 50) {
    cons.push("Pricing may be steep for solo users or small teams");
  }
  if (tool.status !== "Active") cons.push(`Currently in ${tool.status} status — expect rougher edges`);
  cons.push("Evaluate against your own data, privacy, and compliance requirements before rollout");

  return cons.slice(0, 5);
}

function buildFaqs(tool: AITool): FAQItem[] {
  if (tool.faqs && tool.faqs.length > 0) return tool.faqs;

  return [
    {
      question: `Is ${tool.name} free?`,
      answer:
        tool.freePlan === "Yes"
          ? `Yes, ${tool.name} offers a free plan.`
          : tool.freePlan === "Limited"
            ? `${tool.name} has a limited free tier.`
            : `${tool.name} does not offer a free plan. Pricing starts at $${tool.startingPriceUsd}/mo.`,
    },
    {
      question: `What is ${tool.name} best for?`,
      answer: `${tool.name} is best for: ${tool.bestFor.join(", ")}.`,
    },
    {
      question: `Does ${tool.name} have an API?`,
      answer: tool.apiAvailable
        ? `Yes, ${tool.name} provides API access.`
        : `${tool.name} does not currently offer a public API.`,
    },
    {
      question: `What platforms does ${tool.name} support?`,
      answer: `${tool.name} is available on: ${tool.platforms.join(", ")}.`,
    },
  ];
}

function buildVerdict(tool: AITool) {
  if (tool.editorialVerdict) return tool.editorialVerdict;

  const audience = formatList(tool.targetAudience.slice(0, 2)).toLowerCase() || "most teams";
  const priceNote =
    tool.startingPriceUsd === null
      ? "usage-based pricing"
      : tool.startingPriceUsd === 0
        ? "a free plan"
        : `plans starting at $${tool.startingPriceUsd}/mo`;

  return `${tool.name} is a solid choice for ${audience} looking for ${tool.category.toLowerCase()} software, backed by ${priceNote}. It earns a place on the shortlist when ${formatList(tool.bestFor.slice(0, 2)).toLowerCase() || "its core use case"} matches your workflow — verify current pricing and platform support directly with ${tool.company} before committing.`;
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) return { title: "Tool not found | AiverseWorld" };

  const { title, description, url } = buildToolMeta(tool);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: tool.favicon, alt: tool.name }],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ToolDetailPage({ params, searchParams }: ToolDetailPageProps) {
  const { slug } = await params;
  const { id } = (await searchParams) ?? {};
  const tool = id ? await getToolById(id) : await getToolBySlug(slug);

  if (!tool || tool.slug !== slug) {
    return (
      <div className="space-y-12 pb-10 pt-10">
        <section className={cardClass({ padding: "lg", radius: "card-lg" })}>
          <SectionHeading
            eyebrow="AI Tool"
            title="No tool data available"
            description="This tool listing is unavailable right now. Please try again shortly."
          />
          <Button href="/search" variant="primary" className="mt-6">
            Browse tools
          </Button>
        </section>
      </div>
    );
  }

  const [related, alternativesResult, reviewsResult] = await Promise.all([
    getRelatedTools(tool.id, 8),
    searchTools({ category: tool.category, limit: 24 }),
    getReviews(tool.id, 1, 10),
  ]);
  // Prefer semantic/overlap-ranked related tools; fall back to same-category.
  const alternatives = (related.length > 0
    ? related
    : alternativesResult.tools.filter((item) => item.slug !== tool.slug)
  ).filter((item) => item.slug !== tool.slug);
  const topAlternative = alternatives[0];
  const summaryParagraphs = splitSummaryParagraphs(tool.summary);

  const lastVerifiedLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(tool.lastVerified));

  const priceLabel =
    tool.startingPriceUsd === null
      ? "Usage-based"
      : tool.startingPriceUsd === 0
        ? "Free"
        : `$${tool.startingPriceUsd}/mo`;

  const featureNotes = buildFeatureNotes(tool);
  const pros = buildPros(tool);
  const cons = buildCons(tool);
  const faqs = buildFaqs(tool);
  const verdict = buildVerdict(tool);
  const howItWorks = buildHowItWorks(tool);

  return (
    <div className="space-y-12 pb-10 pt-6">
      <ViewTracker toolId={tool.id} />
      <div className="pt-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: tool.category, href: `/category/${slugify(tool.category)}` },
            { label: tool.name },
          ]}
        />
      </div>
      <StructuredDataScript
        id="tool-detail-schema"
        data={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.name,
            applicationCategory: tool.category,
            description: tool.summary ?? tool.shortDescription,
            operatingSystem: tool.platforms.join(", "),
            url: buildUrl(`/tool/${tool.slug}`),
            sameAs: tool.website,
            dateModified: tool.lastVerified,
            ...(tool.launchYear ? { datePublished: `${tool.launchYear}-01-01` } : {}),
            offers:
              tool.startingPriceUsd === null
                ? undefined
                : { "@type": "Offer", price: tool.startingPriceUsd, priceCurrency: "USD" },
            ...(tool.rating && tool.reviewCount
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: tool.rating,
                    reviewCount: tool.reviewCount,
                    bestRating: 5,
                    worstRating: 1,
                  },
                }
              : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]}
      />

      {/* 1. Header */}
      <FadeInSection>
        <ToolHero tool={tool} priceLabel={priceLabel} lastVerifiedLabel={lastVerifiedLabel} />
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div className={cardClass()}>
            <p className="text-caption text-text-muted">Free plan</p>
            <p className="text-heading-2 mt-2 text-text-primary">{tool.freePlan}</p>
          </div>
          <div className={cardClass()}>
            <p className="text-caption text-text-muted">API access</p>
            <p className="text-heading-2 mt-2 text-text-primary">{tool.apiAvailable ? "Yes" : "No"}</p>
          </div>
          <div className={cardClass()}>
            <p className="text-caption text-text-muted">Open source</p>
            <p className="text-heading-2 mt-2 text-text-primary">{tool.openSource ? "Yes" : "No"}</p>
          </div>
          <div className={cardClass()}>
            <p className="text-caption text-text-muted">Platforms</p>
            <p className="text-heading-2 mt-2 text-text-primary">{tool.platforms.length}</p>
          </div>
        </div>
      </FadeInSection>

      {/* Sticky action bar — stays reachable through the long read */}
      <ToolActionBar tool={tool} />

      {/* 2. Overview */}
      <FadeInSection className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <h2 className="text-heading-1 text-text-primary">What is {tool.name}?</h2>
        <div className="text-body-lg mt-4 space-y-4 text-text-secondary">
          {summaryParagraphs.length > 0 ? (
            summaryParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          ) : (
            <p>{tool.shortDescription}</p>
          )}
        </div>
        <Link
          href={`/category/${slugify(tool.category)}`}
          className="text-sm mt-5 inline-flex font-semibold text-brand-cyan-strong transition hover:text-brand-cyan"
        >
          Explore more {tool.category} tools →
        </Link>
      </FadeInSection>

      {/* 3. How it works */}
      <FadeInSection className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <h2 className="text-heading-1 text-text-primary">How {tool.name} works</h2>
        <p className="text-body-lg mt-4 text-text-secondary">{howItWorks}</p>
      </FadeInSection>

      {/* 4. Key features */}
      <div>
        <SectionHeading
          eyebrow="Key Features"
          title="What makes it worth shortlisting"
          description={`The capabilities that matter most for teams evaluating ${tool.name}.`}
        />
        <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureNotes.map((note, index) => (
            <StaggerItem key={note.feature}>
              <FeatureCard icon={<span>0{index + 1}</span>} title={note.feature} description={note.benefit} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>

      {/* 5. Best use cases + 6. Who should use it */}
      <section className="grid gap-6 lg:grid-cols-2">
        <FadeInSection className={cardClass({ padding: "lg", radius: "card-lg" })}>
          <h2 className="text-heading-1 text-text-primary">Best use cases</h2>
          <div className="mt-5 space-y-3">
            {tool.bestFor.map((item) => (
              <div key={item} className="rounded-sm border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-text-secondary">
                {item}
              </div>
            ))}
          </div>
        </FadeInSection>
        <FadeInSection delay={0.05} className={cardClass({ padding: "lg", radius: "card-lg" })}>
          <h2 className="text-heading-1 text-text-primary">Who should use it</h2>
          <div className="mt-5 space-y-3">
            {tool.targetAudience.map((item) => (
              <div key={item} className="rounded-sm border border-border-accent bg-brand-cyan/8 px-4 py-3 text-sm text-brand-cyan-strong">
                {item}
              </div>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* 7 & 8. Pros and cons */}
      <section className="grid gap-6 lg:grid-cols-2">
        <FadeInSection className={cardClass({ padding: "lg", radius: "card-lg" })}>
          <h2 className="text-heading-1 text-text-primary">Pros</h2>
          <ul className="mt-5 space-y-3">
            {pros.map((item) => (
              <li key={item} className="text-body flex items-start gap-3 text-text-secondary">
                <span className="mt-0.5 text-emerald-300" aria-hidden>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </FadeInSection>
        <FadeInSection delay={0.05} className={cardClass({ padding: "lg", radius: "card-lg" })}>
          <h2 className="text-heading-1 text-text-primary">Cons</h2>
          <ul className="mt-5 space-y-3">
            {cons.map((item) => (
              <li key={item} className="text-body flex items-start gap-3 text-text-secondary">
                <span className="mt-0.5 text-rose-300" aria-hidden>✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </FadeInSection>
      </section>

      {/* 9. Pricing analysis */}
      <div className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <SectionHeading
          eyebrow="Pricing Analysis"
          title="Is it worth the price?"
          description={tool.pricingNotes || `${tool.name} uses a ${tool.pricingModel.toLowerCase()} pricing model.`}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={cardClass()}>
            <p className="text-caption text-text-muted">Model</p>
            <p className="text-heading-2 mt-2 text-text-primary">{tool.pricingModel}</p>
          </div>
          <div className={cardClass()}>
            <p className="text-caption text-text-muted">Starting price</p>
            <p className="text-heading-2 mt-2 text-text-primary">{priceLabel}</p>
          </div>
          <div className={cardClass()}>
            <p className="text-caption text-text-muted">Free trial</p>
            <p className="text-heading-2 mt-2 text-text-primary">{tool.freeTrial ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      {/* 10. Alternatives / similar tools (relevance-ranked) */}
      {alternatives.length > 0 ? (
        <div>
          <SectionHeading
            eyebrow="Similar Tools"
            title={`Tools like ${tool.name}`}
            description={
              tool.alternativesNote ||
              "The closest alternatives by category, capability, and audience — ranked by relevance."
            }
          />
          <StaggerGrid className="grid gap-6 lg:grid-cols-3">
            {alternatives.slice(0, 6).map((item) => (
              <StaggerItem key={item.slug}>
                <ToolCard tool={item} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      ) : null}

      {/* 11. Comparison table */}
      {topAlternative ? (
        <div>
          <SectionHeading
            eyebrow="Comparison"
            title={`${tool.name} vs ${topAlternative.name}`}
            description="A side-by-side look at the closest alternative in this category."
            action={
              <Button href={`/compare?leftId=${encodeURIComponent(tool.id)}&rightId=${encodeURIComponent(topAlternative.id)}`} variant="outline">
                Full comparison
              </Button>
            }
          />
          <ComparisonTable tools={[tool, topAlternative]} />
        </div>
      ) : null}

      {/* Technical details + Reviews */}
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={cardClass({ padding: "lg", radius: "card-lg" })}>
          <SectionHeading
            eyebrow="Details"
            title="Technical & deployment info"
            description="Key facts about model providers, integrations, and team support."
          />
          <div className="space-y-3">
            {tool.modelProvider.length > 0 ? (
              <div className={cardClass({ padding: "sm" })}>
                <p className="text-caption text-text-muted">Model Provider</p>
                <p className="text-sm mt-1 text-text-primary">{tool.modelProvider.join(", ")}</p>
              </div>
            ) : null}
            {tool.integrations && tool.integrations.length > 0 ? (
              <div className={cardClass({ padding: "sm" })}>
                <p className="text-caption text-text-muted">Integrations</p>
                <p className="text-sm mt-1 text-text-primary">{tool.integrations.join(", ")}</p>
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <div className={cardClass({ padding: "sm" })}>
                <p className="text-caption text-text-muted">Team Collaboration</p>
                <p className="text-sm mt-1 font-semibold text-text-primary">{tool.teamCollaboration ? "Yes" : "No"}</p>
              </div>
              <div className={cardClass({ padding: "sm" })}>
                <p className="text-caption text-text-muted">Launch Year</p>
                <p className="text-sm mt-1 font-semibold text-text-primary">{tool.launchYear ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={cardClass({ padding: "lg", radius: "card-lg" })}>
          <SectionHeading
            eyebrow="Reviews"
            title="What users are saying"
            description="Verified reviews from signed-in users, stored in the backend and averaged into this tool's rating."
          />
          <ReviewSection
            toolId={tool.id}
            toolName={tool.name}
            initialReviews={reviewsResult.data}
            initialAverage={reviewsResult.average}
            initialTotal={reviewsResult.total}
            initialDistribution={reviewsResult.distribution}
            callbackUrl={`/tool/${tool.slug}`}
          />
        </div>
      </section>

      {/* 12. FAQ */}
      <div>
        <SectionHeading eyebrow="FAQ" title={`Common questions about ${tool.name}`} />
        <FAQAccordion items={faqs} />
      </div>

      {/* 13. Editorial verdict */}
      <EditorialBlock eyebrow="Editorial Verdict" title={`Should you use ${tool.name}?`} tone="verdict">
        <p>{verdict}</p>
        <p className="text-caption text-text-muted">Last verified {lastVerifiedLabel}.</p>
      </EditorialBlock>

      {/* Continue exploring — personalized recently-viewed (signed-in) */}
      <RecentlyViewedRail excludeId={tool.id} />
    </div>
  );
}
