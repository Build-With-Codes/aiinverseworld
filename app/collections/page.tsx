import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cardClass } from "@/components/ui/card";
import { FadeInSection } from "@/components/ui/motion";
import { getCollections } from "@/lib/engagement";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Tool Collections — Expert-Curated Roundups | AiverseWorld",
  description:
    "Browse expert-curated collections of the best AI tools by goal and audience — best of 2026, top free tools, ChatGPT alternatives, image generators, and more.",
  alternates: { canonical: buildUrl("/collections") },
  openGraph: {
    title: "AI Tool Collections | AiverseWorld",
    description:
      "Expert-curated collections of the best AI tools by goal and audience.",
    url: buildUrl("/collections"),
    type: "website",
    images: [defaultOpenGraphImage],
  },
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="space-y-10 pb-10 pt-6">
      <div className="pt-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
      </div>
      <FadeInSection className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <SectionHeading
          eyebrow="Collections"
          title="Expert-curated AI tool collections"
          description="Hand-picked, editorial roundups for specific goals and audiences — each with a buying guide and comparisons."
        />
      </FadeInSection>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className={cardClass({ hover: true })}
          >
            <span aria-hidden className="text-3xl">
              {collection.emoji}
            </span>
            <h2 className="text-heading-2 mt-3 text-text-primary">{collection.title}</h2>
            <p className="text-body mt-2 text-text-secondary">{collection.tagline}</p>
            <span className="text-caption mt-4 inline-block text-brand-cyan-strong">
              Explore collection →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
