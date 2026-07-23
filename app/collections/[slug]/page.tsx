import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ComparisonTable } from "@/components/comparison-table";
import { Badge } from "@/components/ui/badge";
import { cardClass } from "@/components/ui/card";
import { EditorialBlock } from "@/components/ui/editorial-block";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { FadeInSection, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import { StructuredDataScript } from "@/components/structured-data-script";
import { getCollection } from "@/lib/engagement";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) return { title: "Collection not found | AiverseWorld" };

  const url = buildUrl(`/collections/${slug}`);
  return {
    title: collection.seoTitle,
    description: collection.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: collection.seoTitle,
      description: collection.seoDescription,
      url,
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: collection.seoTitle,
      description: collection.seoDescription,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) notFound();

  const comparisonTools = collection.tools.slice(0, 3);

  return (
    <div className="space-y-12 pb-10 pt-6">
      <div className="pt-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: collection.title },
          ]}
        />
      </div>
      <StructuredDataScript
        id="collection-schema"
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: collection.title,
            description: collection.seoDescription,
            url: buildUrl(`/collections/${slug}`),
            hasPart: collection.tools.slice(0, 10).map((tool) => ({
              "@type": "SoftwareApplication",
              name: tool.name,
              url: buildUrl(`/tool/${tool.slug}`),
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: collection.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          },
        ]}
      />

      {/* Hero */}
      <FadeInSection className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <div className="flex items-center gap-3">
          <span aria-hidden className="text-3xl">
            {collection.emoji}
          </span>
          <Badge variant="brand">Collection</Badge>
        </div>
        <h1 className="text-display-2 mt-4 text-text-primary">{collection.title}</h1>
        <p className="text-body-lg mt-4 max-w-3xl text-text-secondary">{collection.intro}</p>
        {collection.body.map((paragraph) => (
          <p key={paragraph} className="text-body mt-4 max-w-3xl text-text-secondary">
            {paragraph}
          </p>
        ))}
      </FadeInSection>

      {/* Best tools */}
      <div>
        <SectionHeading eyebrow="The Shortlist" title={`Top picks in ${collection.title}`} />
        <StaggerGrid className="grid gap-6 lg:grid-cols-3">
          {collection.tools.map((tool) => (
            <StaggerItem key={tool.slug}>
              <ToolCard tool={tool} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>

      {/* Comparison */}
      {comparisonTools.length >= 2 ? (
        <div>
          <SectionHeading
            eyebrow="Compare"
            title={comparisonTools.map((t) => t.name).join(" vs ")}
            description="The top picks in this collection, side by side."
          />
          <ComparisonTable tools={comparisonTools} highlightDifferences />
        </div>
      ) : null}

      {/* Buying guide */}
      {collection.buyingGuide.length > 0 ? (
        <EditorialBlock eyebrow="Buying Guide" title="How to choose">
          <ul className="space-y-3">
            {collection.buyingGuide.map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="mt-1 text-brand-cyan-strong" aria-hidden>
                  →
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </EditorialBlock>
      ) : null}

      {/* FAQs */}
      {collection.faqs.length > 0 ? (
        <div>
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <FAQAccordion items={collection.faqs} />
        </div>
      ) : null}
    </div>
  );
}
