import type { Metadata } from "next";
import Link from "next/link";

import { NewsCard } from "@/components/news-card";
import { CategoryCard } from "@/components/category-card";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { getNewsArticles } from "@/lib/news";
import { buildUrl } from "@/lib/seo";
import { categories, comparisons, finderQuestions, tools, bestLists } from "@/lib/site-data";
import { HeroSearch } from "@/components/hero-search";

export const metadata: Metadata = {
  alternates: {
    canonical: buildUrl("/"),
  },
  openGraph: {
    url: buildUrl("/"),
  },
};



const aiFinderOptions = [
  {
    title: "Growth teams",
    description: "Find writing, SEO, image, and analytics tools in one flow.",
  },
  {
    title: "Builders",
    description: "Compare copilots, agents, code search, and automation stacks.",
  },
  {
    title: "Creators",
    description: "Explore tools for visuals, video, voice, and campaign production.",
  },
];

const discoveryBands = [
  {
    title: "For marketers",
    description: "Find content, SEO, image, and campaign tools with faster shortlist paths.",
    accent: "from-cyan-400/16 via-sky-500/10 to-transparent",
  },
  {
    title: "For builders",
    description: "Compare copilots, agents, dev platforms, and workflow automation stacks.",
    accent: "from-violet-400/16 via-indigo-500/10 to-transparent",
  },
  {
    title: "For teams",
    description: "Evaluate productivity, research, support, and operations tools in one place.",
    accent: "from-emerald-400/16 via-teal-500/10 to-transparent",
  },
];

export default async function Home() {
  const trendingTools = tools.slice(0, 6);
  const codingTools = tools.filter((tool) => tool.category === "Coding AI").slice(0, 6);
  const creativeTools = tools
    .filter((tool) => ["Image AI", "Video AI", "Design AI"].includes(tool.category))
    .slice(0, 6);
  const newsArticles = await getNewsArticles(3);
  const spotlightMetrics = [
    { label: "Indexed tools", value: `${tools.length}` },
    { label: "Categories covered", value: `${categories.length}` },
    { label: "Free plan tools", value: `${tools.filter((t) => t.freePlan === "Yes").length}` },
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
                <div
                  key={question}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#091322] px-4 py-3"
                >
                  <span className="text-sm text-slate-200">{question}</span>
                  <span className="text-xs text-slate-500">0{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-7">
            <p className="text-sm font-medium text-slate-300">Built for every operator</p>
            <div className="mt-5 space-y-4">
              {aiFinderOptions.map((option) => (
                <div key={option.title} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                  <h3 className="font-semibold text-white">{option.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {option.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {discoveryBands.map((band) => (
          <div
            key={band.title}
            className={`rounded-[30px] border border-white/10 bg-linear-to-br ${band.accent} p-6 shadow-[0_20px_60px_rgba(3,8,22,0.28)]`}
          >
            <p className="text-sm font-semibold text-white">{band.title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{band.description}</p>
          </div>
        ))}
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
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <SectionHeading
            eyebrow="Compare"
            title="Popular AI tool matchups"
            description="Jump into high-intent comparisons people use before purchase and rollout decisions."
          />
          <div className="space-y-4">
            {comparisons.map((comparison) => (
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
          {bestLists.map((list) => (
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
