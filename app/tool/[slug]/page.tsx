import { authOptions } from "@/auth";
import { AuthDialog } from "@/components/auth-dialog";
import { FaviconBadge } from "@/components/favicon-badge";
import { ReviewForm } from "@/components/review-form";
import { googleAuthEnabled } from "@/lib/auth-config";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { getReviewsForTool } from "@/lib/review-store";
import { buildUrl } from "@/lib/seo";
import { getToolBySlug, tools } from "@/lib/site-data";
import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type ToolDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool not found | AiverseWorld",
    };
  }

  return {
    title: `${tool.name} Review, Pricing, and Alternatives | AiverseWorld`,
    description: tool.description,
    alternates: {
      canonical: buildUrl(`/tool/${tool.slug}`),
    },
    openGraph: {
      title: `${tool.name} Review, Pricing, and Alternatives | AiverseWorld`,
      description: tool.description,
      url: buildUrl(`/tool/${tool.slug}`),
      type: "article",
    },
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const alternatives = tools.filter(
    (candidate) =>
      candidate.categorySlug === tool.categorySlug && candidate.slug !== tool.slug,
  );
  const toolReviews = await getReviewsForTool(tool.slug);

  return (
    <div className="space-y-12 pb-10 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.name,
            applicationCategory: tool.category,
            description: tool.description,
            operatingSystem: "Web",
            url: buildUrl(`/tool/${tool.slug}`),
            sameAs: tool.website,
            offers:
              tool.startingPrice === "Usage" || tool.startingPrice === "Included"
                ? undefined
                : {
                    "@type": "Offer",
                    price: tool.startingPrice,
                    priceCurrency: "USD",
                  },
          }),
        }}
      />
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <div className="flex flex-wrap items-center gap-3">
            <FaviconBadge
              name={tool.name}
              faviconUrl={tool.faviconUrl}
              className="h-12 w-12 rounded-2xl"
              imgClassName="p-2"
              labelClassName="text-sm"
            />
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-[0.24em] text-cyan-100 uppercase">
              {tool.category}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {tool.free === "Yes" ? "Free available" : tool.free === "Limited" ? "Limited free" : "Paid only"}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              Starts {tool.startingPrice === "Usage" || tool.startingPrice === "Included" ? tool.startingPrice : `$${tool.startingPrice}/mo`}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {tool.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            {tool.description}
          </p>

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
              href={`/compare/${tool.slug}-vs-${alternatives[0]?.slug ?? "nova-write"}`}
              className="rounded-2xl border border-white/10 bg-white/6 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-300/30"
            >
              Compare Tool
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-[#081222] p-5">
              <p className="text-sm text-slate-400">Official Site</p>
              <p className="mt-3 text-lg font-semibold text-white">{tool.website.replace(/^https?:\/\//, "")}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#081222] p-5">
              <p className="text-sm text-slate-400">Starting Price</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {tool.startingPrice === "Usage" || tool.startingPrice === "Included" ? tool.startingPrice : `$${tool.startingPrice}/mo`}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#081222] p-5">
              <p className="text-sm text-slate-400">Free Access</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {tool.free}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <SectionHeading
            eyebrow="Quick Snapshot"
            title="Why teams shortlist this tool"
            description={tool.tagline}
          />
          <div className="space-y-4">
            {tool.useCases.map((feature) => (
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
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">Use Cases</h2>
          <div className="mt-5 space-y-3">
            {tool.useCases.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-[#081222] px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">Description</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/8 px-4 py-3 text-sm text-emerald-100">
              {tool.description}
            </div>
          </div>
        </div>
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <h2 className="text-xl font-semibold text-white">Brand Mark</h2>
          <div className="mt-5 space-y-3">
            <div className="flex min-h-36 items-center justify-center overflow-hidden rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4">
              <FaviconBadge
                name={tool.name}
                faviconUrl={tool.faviconUrl}
                className="h-24 w-24 rounded-3xl"
                imgClassName="p-4"
                labelClassName="text-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[30px] border border-white/10 bg-white/6 p-7">
          <SectionHeading
            eyebrow="Brand"
            title="Favicon-based listing"
            description="This tool entry now uses the official favicon only, with alphabet fallback if the icon does not load."
          />
          <div className="rounded-[26px] border border-white/10 bg-[#081222] p-6">
            <div className="flex items-center gap-4">
              <FaviconBadge
                name={tool.name}
                faviconUrl={tool.faviconUrl}
                className="h-16 w-16 rounded-3xl"
                imgClassName="p-3"
                labelClassName="text-2xl"
              />
              <div>
                <p className="text-lg font-semibold text-white">{tool.name}</p>
                <p className="mt-1 text-sm text-slate-400">{tool.faviconUrl}</p>
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
                    <p className="text-sm font-medium text-cyan-200">
                      {review.rating.toFixed(1)} / 5
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {review.comment}
                  </p>
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
