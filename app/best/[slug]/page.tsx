import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { ToolCard } from "@/components/tool-card";
import { SectionHeading } from "@/components/section-heading";
import { buildUrl } from "@/lib/seo";
import { bestLists, getBestList, getBestListTools } from "@/lib/site-data";

type BestPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return bestLists.map((list) => ({ slug: list.slug }));
}

export async function generateMetadata({ params }: BestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const list = getBestList(slug);

  if (!list) return { title: "Not Found | AiverseWorld" };

  return {
    title: `${list.title} | AiverseWorld`,
    description: list.description,
    alternates: { canonical: buildUrl(`/best/${slug}`) },
    openGraph: {
      title: `${list.title} | AiverseWorld`,
      description: list.description,
      url: buildUrl(`/best/${slug}`),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${list.title} | AiverseWorld`,
      description: list.description,
    },
  };
}

export default async function BestPage({ params }: BestPageProps) {
  const { slug } = await params;
  const list = getBestList(slug);

  if (!list) notFound();

  const tools = getBestListTools(slug);

  return (
    <div className="space-y-12 pb-10 pt-10 sm:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: list.title,
            description: list.description,
            url: buildUrl(`/best/${slug}`),
            numberOfItems: tools.length,
            itemListElement: tools.slice(0, 10).map((tool, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: tool.name,
              url: buildUrl(`/tool/${tool.slug}`),
              description: tool.shortDescription,
            })),
          }),
        }}
      />

      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <div className="mb-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-cyan-100 uppercase">
          {list.eyebrow}
        </div>
        <SectionHeading
          eyebrow=""
          title={list.title}
          description={list.description}
        />
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{tools.length} tools listed</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Sorted by popularity</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Updated 2025</span>
        </div>
      </section>

      {tools.length > 0 ? (
        <section className="grid gap-6 lg:grid-cols-3">
          {tools.map((tool, i) => (
            <div key={tool.slug} className="relative">
              {i < 3 && (
                <div className="absolute -top-3 -left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/15 text-xs font-bold text-cyan-200">
                  #{i + 1}
                </div>
              )}
              <ToolCard tool={tool} />
            </div>
          ))}
        </section>
      ) : (
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-10 text-center text-sm text-slate-400">
          No tools found for this list.
        </div>
      )}

      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <p className="mb-4 text-sm font-semibold text-slate-300">Explore more lists</p>
        <div className="flex flex-wrap gap-3">
          {bestLists.filter((l) => l.slug !== slug).map((l) => (
            <Link
              key={l.slug}
              href={`/best/${l.slug}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
            >
              {l.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
