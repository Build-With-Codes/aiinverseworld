import { authOptions } from "@/auth";
import { AuthDialog } from "@/components/auth-dialog";
import { FaviconBadge } from "@/components/favicon-badge";
import { ReviewForm } from "@/components/review-form";
import { StructuredDataScript } from "@/components/structured-data-script";
import { googleAuthEnabled } from "@/lib/auth-config";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { getReviewsForTool } from "@/lib/review-store";
import { buildUrl, buildToolMeta } from "@/lib/seo";
import { getToolById, getToolBySlug, searchTools } from "@/lib/tool-catalog";
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";

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
        <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <SectionHeading
            eyebrow="AI Tool"
            title="No tool data available"
            description="This tool listing is unavailable right now. Please try again shortly."
          />
          <Link
            href="/search"
            className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Browse tools
          </Link>
        </section>
      </div>
    );
  }

  const session = await getServerSession(authOptions);
  const alternativesResult = await searchTools({
    category: tool.category,
    limit: 24,
  });
  const alternatives = alternativesResult.tools.filter((item) => item.slug !== tool.slug);
  const toolReviews = await getReviewsForTool(tool.slug);
  const summaryParagraphs = splitSummaryParagraphs(tool.summary);
  const primaryFeatures = tool.features.slice(0, 4);
  const primaryUseCases = tool.bestFor.slice(0, 4);
  const primaryAudience = tool.targetAudience.slice(0, 4);
  const editorialOverview = `${tool.name} is a ${tool.category.toLowerCase()} from ${tool.company} focused on ${formatList(primaryUseCases).toLowerCase() || "AI-assisted work"}. It is most relevant for ${formatList(primaryAudience).toLowerCase() || "teams and individual users"} who need ${tool.shortDescription.toLowerCase()}`;
  const editorialUseCases = `${tool.name} is worth shortlisting when your workflow needs ${formatList(primaryFeatures).toLowerCase() || "repeatable AI support"}. The strongest fit is usually ${formatList(primaryUseCases).toLowerCase() || "day-to-day productivity"}, especially for users comparing tools by pricing, supported platforms, deployment model, and practical integrations.`;
  const editorialLimitations = `${tool.name} should still be reviewed against your own security, accuracy, privacy, and budget requirements before rollout. Pricing, model availability, supported integrations, and product limits can change, so verify the latest details on the official ${tool.company} website before making a purchase or enterprise deployment decision.`;
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

  return (
    <div className="space-y-12 pb-10 pt-10">
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
              offers: tool.startingPriceUsd === null
                ? undefined
                : { "@type": "Offer", price: tool.startingPriceUsd, priceCurrency: "USD" },
              ...(tool.rating && tool.reviewCount ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: tool.rating,
                  reviewCount: tool.reviewCount,
                  bestRating: 5,
                  worstRating: 1,
                },
              } : {}),
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `Is ${tool.name} free?`,
                  acceptedAnswer: { "@type": "Answer", text: tool.freePlan === "Yes" ? `Yes, ${tool.name} offers a free plan.` : tool.freePlan === "Limited" ? `${tool.name} has a limited free tier.` : `${tool.name} does not offer a free plan. Pricing starts at $${tool.startingPriceUsd}/mo.` },
                },
                {
                  "@type": "Question",
                  name: `What is ${tool.name} best for?`,
                  acceptedAnswer: { "@type": "Answer", text: `${tool.name} is best for: ${tool.bestFor.join(", ")}.` },
                },
                {
                  "@type": "Question",
                  name: `Does ${tool.name} have an API?`,
                  acceptedAnswer: { "@type": "Answer", text: tool.apiAvailable ? `Yes, ${tool.name} provides API access.` : `${tool.name} does not currently offer a public API.` },
                },
                {
                  "@type": "Question",
                  name: `What platforms does ${tool.name} support?`,
                  acceptedAnswer: { "@type": "Answer", text: `${tool.name} is available on: ${tool.platforms.join(", ")}.` },
                },
              ],
            },
          ]}
      />

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <div className="flex flex-wrap items-center gap-3">
            <FaviconBadge
              name={tool.name}
              faviconUrl={tool.favicon}
              className="h-12 w-12 rounded-2xl"
              imgClassName="p-2"
              labelClassName="text-sm"
            />
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-cyan-100 uppercase">
              {tool.category}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {tool.subcategory}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {tool.pricingModel}
            </span>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
              Last verified{" "}
              <time dateTime={tool.lastVerified}>{lastVerifiedLabel}</time>
            </span>
            {tool.status !== "Active" && (
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
                {tool.status}
              </span>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {tool.name}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{tool.company} · {tool.domain}</p>
          <div className="mt-4 max-w-3xl space-y-4 text-lg leading-8 text-slate-300">
            {summaryParagraphs.length > 0 ? (
              summaryParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            ) : (
              <p>{tool.shortDescription}</p>
            )}
          </div>

          {/* Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tool.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={tool.website}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              Visit Website
            </a>
            <Link
              href={
                alternatives[0]
                  ? `/compare?leftId=${encodeURIComponent(tool.id)}&rightId=${encodeURIComponent(alternatives[0].id)}`
                  : "/compare"
              }
              className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-300/30"
            >
              Compare Tool
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            <div className="rounded-[24px] border border-white/10 bg-[#081222] p-5">
              <p className="text-sm text-slate-400">Starting Price</p>
              <p className="mt-3 text-lg font-semibold text-white">{priceLabel}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#081222] p-5">
              <p className="text-sm text-slate-400">Free Plan</p>
              <p className="mt-3 text-lg font-semibold text-white">{tool.freePlan}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#081222] p-5">
              <p className="text-sm text-slate-400">API</p>
              <p className="mt-3 text-lg font-semibold text-white">{tool.apiAvailable ? "Yes" : "No"}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#081222] p-5">
              <p className="text-sm text-slate-400">Open Source</p>
              <p className="mt-3 text-lg font-semibold text-white">{tool.openSource ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <SectionHeading
            eyebrow="Quick Snapshot"
            title="Why teams shortlist this tool"
            description={tool.shortDescription}
          />
          <div className="space-y-3">
            {tool.features.map((feature) => (
              <div
                key={feature}
                className="rounded-[22px] border border-white/10 bg-[#081222] px-5 py-4 text-sm text-slate-200"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-2xl font-semibold text-white">What is {tool.name}?</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            {editorialOverview}
          </p>
        </article>
        <article className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-2xl font-semibold text-white">Best use cases</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            {editorialUseCases}
          </p>
        </article>
        <article className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-2xl font-semibold text-white">Limitations to check</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            {editorialLimitations}
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">Best For</h2>
          <div className="mt-5 space-y-3">
            {tool.bestFor.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-[#081222] px-4 py-3 text-sm text-slate-200">{item}</div>
            ))}
          </div>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">Target Audience</h2>
          <div className="mt-5 space-y-3">
            {tool.targetAudience.map((item) => (
              <div key={item} className="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 px-4 py-3 text-sm text-cyan-100">{item}</div>
            ))}
          </div>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">Platforms</h2>
          <div className="mt-5 space-y-3">
            {tool.platforms.map((p) => (
              <div key={p} className="rounded-2xl border border-white/10 bg-[#081222] px-4 py-3 text-sm text-slate-200">{p}</div>
            ))}
          </div>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">Modalities</h2>
          <div className="mt-5 space-y-3">
            {tool.modalities.map((m) => (
              <div key={m} className="rounded-2xl border border-violet-300/15 bg-violet-300/8 px-4 py-3 text-sm text-violet-200">{m}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">AI Type</h2>
          <div className="mt-5 space-y-3">
            {tool.aiType.map((t) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-[#081222] px-4 py-3 text-sm text-slate-200">{t}</div>
            ))}
          </div>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">Deployment</h2>
          <div className="mt-5 space-y-3">
            {tool.deploymentType.map((d) => (
              <div key={d} className="rounded-2xl border border-white/10 bg-[#081222] px-4 py-3 text-sm text-slate-200">{d}</div>
            ))}
          </div>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">Brand</h2>
          <div className="mt-5 flex min-h-36 items-center justify-center overflow-hidden rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4">
            <FaviconBadge
              name={tool.name}
              faviconUrl={tool.favicon}
              className="h-24 w-24 rounded-3xl"
              imgClassName="p-4"
              labelClassName="text-3xl"
            />
          </div>
          {tool.privacyNotes && (
            <p className="mt-4 text-xs leading-6 text-slate-400">{tool.privacyNotes}</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <SectionHeading
            eyebrow="Details"
            title="Technical & deployment info"
            description="Key facts about model providers, integrations, and team support."
          />
          <div className="space-y-3">
            {tool.modelProvider.length > 0 && (
              <div className="rounded-[24px] border border-white/10 bg-[#081222] p-4">
                <p className="text-xs text-slate-400">Model Provider</p>
                <p className="mt-1 text-sm text-white">{tool.modelProvider.join(", ")}</p>
              </div>
            )}
            {tool.modelNames && tool.modelNames.length > 0 && (
              <div className="rounded-[24px] border border-white/10 bg-[#081222] p-4">
                <p className="text-xs text-slate-400">Models</p>
                <p className="mt-1 text-sm text-white">{tool.modelNames.join(", ")}</p>
              </div>
            )}
            {tool.integrations && tool.integrations.length > 0 && (
              <div className="rounded-[24px] border border-white/10 bg-[#081222] p-4">
                <p className="text-xs text-slate-400">Integrations</p>
                <p className="mt-1 text-sm text-white">{tool.integrations.join(", ")}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[24px] border border-white/10 bg-[#081222] p-4">
                <p className="text-xs text-slate-400">Team Collaboration</p>
                <p className="mt-1 text-sm font-semibold text-white">{tool.teamCollaboration ? "Yes" : "No"}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-[#081222] p-4">
                <p className="text-xs text-slate-400">Launch Year</p>
                <p className="mt-1 text-sm font-semibold text-white">{tool.launchYear ?? "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <SectionHeading
            eyebrow="Reviews"
            title="What users are saying"
            description="Authenticated Google users can post verified reviews saved through your backend layer."
          />
          <div className="mb-6 rounded-[24px] border border-white/10 bg-[#081222] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">Community reviews</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">
                  {session?.user
                    ? "You are signed in and can leave one review per tool."
                    : "Sign in with Google to leave a verified review stored in your backend."}
                </p>
              </div>
              {session?.user ? (
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
                  Signed in as {session.user.name || session.user.email}
                </div>
              ) : (
                <AuthDialog
                  callbackUrl={`/tool/${tool.slug}`}
                  enabled={googleAuthEnabled}
                  triggerClassName="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                  triggerLabel="Sign In to Review"
                  title={`Review ${tool.name}`}
                  description="Use your Google account to post a verified review, update your rating later, and keep your AI evaluation history in one place."
                />
              )}
            </div>
            {session?.user ? (
              <div className="mt-5">
                <ReviewForm toolSlug={tool.slug} />
              </div>
            ) : null}
          </div>
          <div className="space-y-4">
            {toolReviews.length > 0 ? (
              toolReviews.map((review) => (
                <div key={review.id} className="rounded-[24px] border border-white/10 bg-[#081222] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{review.author}</p>
                      <p className="text-sm text-slate-400">{review.role}</p>
                    </div>
                    <p className="text-sm font-medium text-cyan-200">{review.rating.toFixed(1)} / 5</p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{review.comment}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-[#081222] p-5 text-sm text-slate-300">
                Reviews are coming soon for this listing.
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Alternatives"
          title={`Explore other ${tool.category} tools`}
          description="Nearby options in the same category for deeper evaluation and side-by-side comparison."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {alternatives.map((item) => (
            <ToolCard key={item.slug} tool={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
