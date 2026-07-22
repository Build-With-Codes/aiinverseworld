import type { Metadata } from "next";
import Link from "next/link";

import { ToolCard } from "@/components/tool-card";
import { SectionHeading } from "@/components/section-heading";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildUrl, defaultOpenGraphImage, formatDisplayDate, getLatestVerifiedDate } from "@/lib/seo";
import { getBestLists, getBestListWithTools } from "@/lib/tool-catalog";

type BestPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BestPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBestListWithTools(slug);
  const list = result?.list;

  if (!list) return { title: "Not Found | AiverseWorld" };
  const dateModified = getLatestVerifiedDate(result?.tools ?? []);

  return {
    title: `${list.title} ${new Date().getFullYear()} — Ranked & Reviewed | AiverseWorld`,
    description: list.description,
    alternates: { canonical: buildUrl(`/best/${slug}`) },
    openGraph: {
      title: `${list.title} ${new Date().getFullYear()} | AiverseWorld`,
      description: list.description,
      url: buildUrl(`/best/${slug}`),
      type: "website",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${list.title} ${new Date().getFullYear()} | AiverseWorld`,
      description: list.description,
      images: [defaultOpenGraphImage.url],
    },
  };
}

export default async function BestPage({ params, searchParams }: BestPageProps) {
  const { slug } = await params;
  const { page: pageParam } = (await searchParams) ?? {};
  const page = Math.max(1, Number(pageParam) || 1);
  const [result, allLists] = await Promise.all([
    getBestListWithTools(slug, page, 24),
    getBestLists(),
  ]);

  if (!result) {
    return (
      <div className="space-y-8 pb-10 pt-10 sm:pt-14">
        <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <SectionHeading
            eyebrow="Best AI Tools"
            title="No data available"
            description="This list is unavailable right now. Please check back shortly."
          />
        </section>
      </div>
    );
  }

  const { list, tools, pagination } = result;
  const dateModified = getLatestVerifiedDate(tools);
  const dateModifiedLabel = formatDisplayDate(dateModified);

  return (
    <div className="space-y-12 pb-10 pt-10 sm:pt-14">
      <StructuredDataScript
        id="best-list-schema"
        data={[
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: list.title,
              description: list.description,
              url: buildUrl(`/best/${slug}`),
              dateModified,
              numberOfItems: tools.length,
              itemListElement: tools.slice(0, 10).map((tool, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: tool.name,
                url: buildUrl(`/tool/${tool.slug}`),
                description: tool.shortDescription,
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `What are the ${list.title.toLowerCase()}?`,
                  acceptedAnswer: { "@type": "Answer", text: `${list.description} Top picks include: ${tools.slice(0, 5).map((t) => t.name).join(", ")}.` },
                },
                {
                  "@type": "Question",
                  name: `How many ${list.title.toLowerCase()} are there?`,
                  acceptedAnswer: { "@type": "Answer", text: `AiverseWorld currently lists ${tools.length} tools in this category, all verified and ranked by popularity and user ratings.` },
                },
                {
                  "@type": "Question",
                  name: `Which of the ${list.title.toLowerCase()} has a free plan?`,
                  acceptedAnswer: { "@type": "Answer", text: `Free plan options include: ${tools.filter((t) => t.freePlan === "Yes").slice(0, 5).map((t) => t.name).join(", ") || "See individual tool pages for details."}.` },
                },
              ],
            },
          ]}
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
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{pagination.total} total matches</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Sorted by popularity</span>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-emerald-100">
            Last updated <time dateTime={dateModified}>{dateModifiedLabel}</time>
          </span>
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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/10 bg-white/6 p-5 text-sm text-slate-300">
        <span>
          Page {pagination.page} of {pagination.totalPages} | {pagination.total} tools
        </span>
        <div className="flex gap-2">
          <Link
            aria-disabled={pagination.page <= 1}
            className={`rounded-2xl border border-white/10 px-4 py-2 ${pagination.page <= 1 ? "pointer-events-none opacity-40" : "hover:border-cyan-300/30 hover:text-white"}`}
            href={`/best/${slug}?page=${Math.max(1, pagination.page - 1)}`}
          >
            Previous
          </Link>
          <Link
            aria-disabled={pagination.page >= pagination.totalPages}
            className={`rounded-2xl border border-white/10 px-4 py-2 ${pagination.page >= pagination.totalPages ? "pointer-events-none opacity-40" : "hover:border-cyan-300/30 hover:text-white"}`}
            href={`/best/${slug}?page=${pagination.page + 1}`}
          >
            Next
          </Link>
        </div>
      </div>

      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <p className="mb-4 text-sm font-semibold text-slate-300">Explore more lists</p>
        <div className="flex flex-wrap gap-3">
          {allLists.lists.filter((l) => l.slug !== slug).map((l) => (
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
