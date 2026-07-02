import type { Metadata } from "next";
import Link from "next/link";

import { NewsCard } from "@/components/news-card";
import { CategoryCard } from "@/components/category-card";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { getNewsArticles } from "@/lib/news";
import { buildUrl } from "@/lib/seo";
import { getBestLists, getComparisons, getToolCatalog, recommendTools } from "@/lib/tool-catalog";
import { getAllBlogPosts } from "@/lib/blog-data";
import { blogSuggestionFAQs } from "@/lib/blog-suggestions";
import { HeroSearch } from "@/components/hero-search";
import { ToolMarquee } from "@/components/tool-marquee";
import {
  aiFinderOptions,
  discoveryBands,
  finderQuestions,
  homeRecommendationQuery,
} from "@/lib/home-content";

export const metadata: Metadata = {
  title: "AI Tools Directory & Reviews 2026 | Discover the Best AI Tools - AiverseWorld",
  description: "Explore, compare, and review the best AI tools for productivity, coding, content creation, video, marketing, and business growth. 100+ tools ranked and reviewed.",
  alternates: {
    canonical: buildUrl("/"),
  },
  openGraph: {
    title: "AI Tools Directory & Reviews 2026 | AiverseWorld",
    description: "Discover the best AI tools for productivity, coding, writing, video, and marketing. Compare 100+ tools with real pricing and reviews.",
    url: buildUrl("/"),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory & Reviews 2026 | AiverseWorld",
    description: "Discover the best AI tools for productivity, coding, writing, video, and marketing.",
  },
};

export default async function Home() {
  const catalog = await getToolCatalog();
  const comparisonCatalog = await getComparisons(12);
  const bestListCatalog = await getBestLists();
  const liveTools = catalog.tools;
  const liveCategories = catalog.categories;
  const liveComparisons = comparisonCatalog.comparisons;
  const liveBestLists = bestListCatalog.lists;
  const trendingTools = liveTools.slice(0, 6);
  const codingTools = liveTools.filter((tool) => tool.category === "Coding Assistant").slice(0, 6);
  const creativeTools = liveTools
    .filter((tool) => ["Image Generation", "Video Generation", "Design Assistant"].includes(tool.category))
    .slice(0, 6);
  const researchRecommendations = await recommendTools(homeRecommendationQuery, 3);
  const newsArticles = await getNewsArticles(3);
  const blogPosts = getAllBlogPosts().slice(0, 6);
  
  const spotlightMetrics = [
    { label: "Indexed tools", value: `${liveTools.length}` },
    { label: "Categories covered", value: `${liveCategories.length}` },
    { label: "Free plan tools", value: `${liveTools.filter((t) => t.freePlan === "Yes").length}` },
  ];

  return (
    <div className="space-y-20 pb-10 pt-10 sm:space-y-24 sm:pt-14">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-cyan-100 uppercase">
            Enterprise-grade AI discovery
          </div>
          <div className="space-y-6">
            <h1 className="max-w-5xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Discover the Perfect AI Tool
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              AiverseWorld is your curated search engine for AI products across
              assistants, coding, video, research, automation, and enterprise
              platforms. Compare real tools, pricing signals, and use cases fast.
            </p>
          </div>

          <HeroSearch />

          <div className="grid gap-4 sm:grid-cols-3">
            {spotlightMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[26px] border border-white/10 bg-white/5 p-5"
              >
                <p className="text-3xl font-semibold text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-400">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[32px] border border-cyan-300/18 bg-linear-to-br from-cyan-400/14 via-blue-500/10 to-violet-500/10 p-7">
            <p className="text-xs font-semibold tracking-[0.28em] text-cyan-200 uppercase">
              AI Finder
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Answer a few questions and get a shortlist in seconds
            </h2>
            <div className="mt-6 space-y-3">
              {finderQuestions.map((question, index) => (
                <Link
                  key={question.label}
                  href={`/?recommend=${encodeURIComponent(question.query)}#ai-finder`}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#091322] px-4 py-3"
                >
                  <span className="text-sm text-slate-200">{question.label}</span>
                  <span className="text-xs text-slate-500">0{index + 1}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-7">
            <p className="text-sm font-medium text-slate-300">Built for every operator</p>
            <div className="mt-5 space-y-4">
              {aiFinderOptions.map((option) => (
                <Link
                  key={option.title}
                  href={`/?recommend=${encodeURIComponent(option.query)}#ai-finder`}
                  className="block rounded-2xl border border-white/8 bg-white/5 p-4 transition hover:border-cyan-300/25 hover:bg-white/8"
                >
                  <h3 className="font-semibold text-white">{option.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {option.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {discoveryBands.map((band) => (
          <Link
            key={band.title}
            href={`/?recommend=${encodeURIComponent(band.query)}#ai-finder`}
            className={`rounded-[30px] border border-white/10 bg-linear-to-br ${band.accent} p-6 shadow-[0_20px_60px_rgba(3,8,22,0.28)]`}
          >
            <p className="text-sm font-semibold text-white">{band.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{band.description}</p>
          </Link>
        ))}
      </section>

      <section className="space-y-3 overflow-hidden">
        <ToolMarquee tools={liveTools.slice(0, 20)} direction="left" />
        <ToolMarquee tools={liveTools.slice(20, 40)} direction="right" />
      </section>

      {/* Blog Posts Section */}
      <section>
        <SectionHeading
          eyebrow="Learning Hub"
          title="AI Guides, Tips & Insights"
          description="Learn how to master AI tools, discover best practices, and stay updated with the latest AI trends and strategies."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/30 hover:bg-white/8"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="bg-cyan-300/10 text-cyan-200 px-2 py-1 rounded text-xs font-medium">
                  {post.category}
                </span>
                <span className="text-xs text-slate-500">{post.readTime}</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-cyan-200 transition line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-3 text-sm text-slate-400 line-clamp-2">
                {post.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <time className="text-xs text-slate-500">{post.publishedAt}</time>
                <span className="text-sm text-cyan-300 group-hover:underline">Read →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex rounded-full border border-cyan-300/25 px-6 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/10"
          >
            View all blog posts →
          </Link>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="AI News"
          title="Enterprise AI news, summarized with attribution"
          description="Track governance, infrastructure, operations, and legal developments through short AI-assisted summaries that link back to the original publishers."
        />
        {newsArticles.length > 0 ? (
          <>
            <div className="mb-5 rounded-[26px] border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-7 text-emerald-100">
              We only display summaries, excerpts, and source metadata here. Readers should use the original links for the complete article and publisher context.
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {newsArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/news"
                className="inline-flex rounded-full border border-cyan-300/25 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/10"
              >
                Explore the full AI news desk
              </Link>
            </div>
          </>
        ) : null}
      </section>

      {researchRecommendations.length > 0 ? (
        <section className="home-recommendations">
          <SectionHeading
            eyebrow="Recommended from catalog"
            title="Tell us the job, get an AI shortlist"
            description="The finder now scores tools against user intent, categories, audiences, tags, platforms, and pricing metadata."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {researchRecommendations.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <SectionHeading
          eyebrow="Featured"
          title="Live AI tools from the current market"
          description="AiverseWorld now showcases the real tools you provided across assistants, coding, creative, productivity, research, and enterprise AI."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {trendingTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Builders"
          title="Coding tools for modern software teams"
          description="From AI-native IDEs to autonomous coding agents, these are the development-focused tools in the live catalog."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {codingTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <SectionHeading
            eyebrow="Explore"
            title="Browse by category"
            description="Move from broad discovery to a focused shortlist with categories optimized for real use cases."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {liveCategories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
        <div>
          <div className="rounded-[34px] border border-white/10 bg-white/6 p-8 mb-6">
            <SectionHeading
              eyebrow="Compare"
              title="Popular AI tool matchups"
              description="Jump into high-intent comparisons people use before purchase and rollout decisions."
            />
            <div className="space-y-4">
              {liveComparisons.slice(0, 12).map((comparison) => (
                <Link
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}`}
                  className="flex flex-col gap-2 rounded-[24px] border border-white/10 bg-[#081222] p-5 transition hover:border-cyan-300/30 hover:bg-[#0a1628]"
                >
                  <span className="text-lg font-semibold text-white">{comparison.title}</span>
                  <span className="text-sm leading-6 text-slate-400">
                    {comparison.summary}
                  </span>
                </Link>
              ))}
              <Link
                href="/compare"
                className="block rounded-[24px] border border-cyan-300/20 bg-cyan-300/8 p-4 text-center text-sm font-semibold text-cyan-200 transition hover:bg-cyan-300/12"
              >
                View all {liveComparisons.length} comparisons →
              </Link>
            </div>
          </div>
          <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
            <p className="text-xs font-semibold tracking-[0.28em] text-cyan-200 uppercase mb-4">People Also Ask</p>
            <div className="space-y-3">
              {(blogSuggestionFAQs["50-chatgpt-prompts-save-hours"] || []).map((faq) => (
                <Link
                  key={faq.question}
                  href={`/blog/${faq.relatedSlug}`}
                  className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-[#081222] p-4 transition hover:border-cyan-300/30 hover:bg-[#0a1628]"
                >
                  <span className="mt-1 text-cyan-400 group-hover:text-cyan-300 flex-shrink-0">▸</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 group-hover:text-white transition line-clamp-2">{faq.question}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Best Of"
          title="Curated AI tool lists"
          description="Hand-picked lists by use case, category, and audience — built from real catalog data."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {liveBestLists.map((list) => (
            <Link
              key={list.slug}
              href={`/best/${list.slug}`}
              className="rounded-[24px] border border-white/10 bg-white/6 p-5 transition hover:border-cyan-300/30 hover:bg-white/8"
            >
              <span className="text-xs font-semibold tracking-[0.22em] text-cyan-200 uppercase">{list.eyebrow}</span>
              <p className="mt-2 font-semibold text-white">{list.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">{list.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Creative"
          title="Image, design, and video tools in one view"
          description="Creative teams can explore image generation, design assistance, and video production tools from the provided live catalog."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {creativeTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[34px] border border-white/10 bg-linear-to-br from-white/8 to-white/4 p-8">
          <SectionHeading
            eyebrow="Newsletter"
            title="Stay on top of new AI releases and pricing changes"
            description="Get a sharp weekly digest with new tools, rising categories, and product updates."
          />
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              aria-label="Email address"
              placeholder="team@company.com"
              className="rounded-2xl border border-white/10 bg-[#071120] px-5 py-4 text-sm text-slate-300 outline-none"
            />
            <button className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
              Join Newsletter
            </button>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
            <p className="text-sm text-slate-400">Review momentum</p>
            <p className="mt-3 text-4xl font-semibold text-white">12,840</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Verified community reviews powering smarter AI tool selection.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
            <p className="text-sm text-slate-400">Bookmark activity</p>
            <p className="mt-3 text-4xl font-semibold text-white">38K</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Teams save, compare, and revisit tools before making buying decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
