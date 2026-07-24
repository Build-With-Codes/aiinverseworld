import type { Metadata } from "next";
import Link from "next/link";

import { FaviconBadge } from "@/components/favicon-badge";
import { NewsCard } from "@/components/news-card";
import { CategoryCard } from "@/components/category-card";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
import { EditorialBlock } from "@/components/ui/editorial-block";
import { FadeInSection, HoverLift, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import { DiscoveryRail } from "@/components/engagement/discovery-rail";
import { RecentlyViewedRail } from "@/components/engagement/recently-viewed-rail";
import { SpotlightCard } from "@/components/engagement/spotlight-card";
import { getNewsArticles } from "@/lib/news";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";
import { getBestLists, getComparisons, getToolCatalog, recommendTools } from "@/lib/tool-catalog";
import {
  getCollections,
  getRankings,
  getSpotlights,
  getTrending,
} from "@/lib/engagement";
import { getAllBlogPosts } from "@/lib/blog-api";
import { blogSuggestionFAQs } from "@/lib/blog-suggestions";
import { HeroSearch } from "@/components/hero-search";
import { ToolMarquee } from "@/components/tool-marquee";
import { aiFinderOptions, finderQuestions, homeRecommendationQuery } from "@/lib/home-content";

const workflowIconPaths: Record<(typeof aiFinderOptions)[number]["icon"], string> = {
  growth: "M1 18l7.5-7.5 5 5L23 6M17 6h6v6",
  builders: "M16 6l6 6-6 6M8 18l-6-6 6-6",
  creators: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z",
};

function WorkflowIcon({ name }: { name: (typeof aiFinderOptions)[number]["icon"] }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
      <path
        d={workflowIconPaths[name]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Best AI Tools Directory & Reviews 2026 | AiverseWorld",
  description: "Explore, compare, and review the best AI tools for productivity, coding, content creation, video, marketing, and business growth. 100+ tools ranked online.",
  alternates: {
    canonical: buildUrl("/"),
  },
  openGraph: {
    title: "AI Tools Directory & Reviews 2026 | AiverseWorld",
    description: "Discover the best AI tools for productivity, coding, writing, video, and marketing. Compare 100+ tools with real pricing and reviews.",
    url: buildUrl("/"),
    type: "website",
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory & Reviews 2026 | AiverseWorld",
    description: "Discover the best AI tools for productivity, coding, writing, video, and marketing.",
    images: [defaultOpenGraphImage.url],
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

  const featuredTools = liveTools.slice(0, 6);
  const recentlyAddedTools = [...liveTools]
    .sort((a, b) => new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime())
    .slice(0, 6);
  const creativeTools = liveTools
    .filter((tool) => ["Image Generation", "Video Generation", "Design Assistant"].includes(tool.category))
    .slice(0, 6);

  // Backend-dynamic engagement data (falls back to popularity when sparse).
  const [spotlights, trendingTools, mostSaved, collections, researchRecommendations, newsArticles, mostSearchedTools] =
    await Promise.all([
      getSpotlights(),
      getTrending("7d", 10),
      getRankings("most-saved", 10),
      getCollections(),
      recommendTools(homeRecommendationQuery, 8),
      getNewsArticles(3),
      getRankings("most-searched", 6),
    ]);
  const trendingQueries = mostSearchedTools.map((tool) => tool.name);
  const blogPosts = (await getAllBlogPosts(12)).slice(0, 6);

  const mostRecentVerified = liveTools.reduce((max, tool) => {
    const time = new Date(tool.lastVerified).getTime();
    return Number.isFinite(time) && time > max ? time : max;
  }, 0);
  // Request-time freshness label — intentionally impure (this is a Server
  // Component computed per request, not memoized render output).
  /* eslint-disable react-hooks/purity */
  const daysSinceVerified = mostRecentVerified
    ? Math.max(0, Math.floor((Date.now() - mostRecentVerified) / 86_400_000))
    : null;
  /* eslint-enable react-hooks/purity */
  const freshnessLabel =
    daysSinceVerified === null
      ? "Weekly"
      : daysSinceVerified === 0
        ? "Today"
        : `${daysSinceVerified}d ago`;

  const proofPoints = [
    { value: `${liveTools.length}+`, label: "AI tools, independently verified" },
    { value: freshnessLabel, label: "Last catalog verification" },
    { value: `${liveCategories.length}`, label: "Categories, each with a buying guide" },
  ];

  return (
    <div className="space-y-12 pb-10 pt-10">
      {/* Hero */}
      <section className="relative grid gap-10 overflow-hidden lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div
          className="hero-orb pointer-events-none absolute -top-32 left-[-10%] h-80 w-80 rounded-full blur-3xl"
          style={{ background: "var(--hero-orb-electric)" }}
          aria-hidden
        />
        <div
          className="hero-orb hero-orb--delay pointer-events-none absolute top-10 right-[-8%] h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--hero-orb-violet)" }}
          aria-hidden
        />

        <div className="relative space-y-8">
          <FadeInSection>
            <Badge variant="brand">Enterprise-grade AI discovery</Badge>
          </FadeInSection>
          <FadeInSection delay={0.05} className="space-y-6">
            <h1 className="text-display-1 max-w-5xl text-text-primary">
              Discover, Compare, and Choose the Best AI Tools
            </h1>
            <p className="text-body-lg max-w-2xl text-text-secondary">
              AiverseWorld is your curated search engine for AI products across
              assistants, coding, video, research, automation, and enterprise
              platforms. Compare real tools, pricing signals, and use cases fast.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <HeroSearch />
          </FadeInSection>

          {trendingQueries.length > 0 ? (
            <FadeInSection delay={0.12} className="flex flex-wrap items-center gap-2">
              <span className="flex shrink-0 items-center gap-2 rounded-full border border-border-accent bg-brand-cyan/10 px-3 py-1.5 text-brand-cyan-strong">
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                  <path
                    d="M3 13.5 7.4 9l3 3 5.4-6.5M12.8 5.5h3v3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>
                <span className="flex flex-col text-[10px] font-semibold uppercase leading-none tracking-[0.18em]">
                  <span>Trending</span>
                  <span className="mt-0.5 text-cyan-100">now</span>
                </span>
              </span>
              {trendingQueries.map((item) => (
                <Link
                  key={item}
                  href={`/search?q=${encodeURIComponent(item)}`}
                  className="shrink-0 rounded-full border border-border-subtle bg-surface-2 px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-border-accent hover:bg-brand-cyan/10 hover:text-text-primary"
                >
                  {item}
                </Link>
              ))}
            </FadeInSection>
          ) : null}

          <StaggerGrid className="grid gap-4 sm:grid-cols-3">
            {proofPoints.map((point) => (
              <StaggerItem key={point.label} className={cardClass()}>
                <p className="flex items-center gap-1.5 text-display-2 text-text-primary [font-variant-numeric:tabular-nums]">
                  <span aria-hidden className="text-base text-brand-cyan-strong">
                    ✓
                  </span>
                  {point.value}
                </p>
                <p className="text-caption mt-2 text-text-muted">{point.label}</p>
              </StaggerItem>
            ))}
          </StaggerGrid>
          <p className="text-caption text-text-muted">
            No pay-to-rank. No sponsored placements in rankings. Every tool links its official
            source so you can verify.
          </p>
        </div>

        <FadeInSection delay={0.15} className="relative grid gap-4">
          <div className={`${cardClass({ padding: "lg", glow: "cyan" })} border-border-accent`}>
            <p className="text-eyebrow text-brand-cyan-strong">AI Finder</p>
            <h2 className="text-heading-1 mt-3 text-text-primary">
              Answer a few questions and get a shortlist in seconds
            </h2>
            <div className="mt-6 space-y-3">
              {finderQuestions.slice(0, 4).map((question, index) => (
                <HoverLift key={question.label}>
                  <Link
                    href={`/?recommend=${encodeURIComponent(question.query)}#ai-finder`}
                    className="flex items-center justify-between rounded-sm border border-border-subtle bg-surface-1 px-4 py-3"
                  >
                    <span className="text-sm text-text-secondary">{question.label}</span>
                    <span className="text-caption text-text-muted">0{index + 1}</span>
                  </Link>
                </HoverLift>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      <section className="space-y-3 overflow-hidden">
        <ToolMarquee tools={liveTools.slice(0, 20)} direction="left" />
        <ToolMarquee tools={liveTools.slice(20, 40)} direction="right" />
      </section>

      {/* Continue exploring — personalized (signed-in returning users) */}
      <RecentlyViewedRail />

      {/* AI Tool Spotlights — premium rotating picks */}
      {spotlights.length > 0 ? (
        <FadeInSection>
          <SectionHeading
            eyebrow="Spotlight"
            title="Editor spotlights"
            description="Rotating premium picks — Tool of the Day, Week, and Month, plus rising and highest-rated standouts."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {spotlights.map((spotlight) => (
              <SpotlightCard key={spotlight.key} spotlight={spotlight} />
            ))}
          </div>
        </FadeInSection>
      ) : null}

      {/* 1. Featured AI Tools */}
      <DiscoveryRail
        eyebrow="Featured"
        title="Featured AI tools this month"
        description="Editorially highlighted tools worth shortlisting first, based on category strength, pricing clarity, and real-world adoption."
        tools={featuredTools}
      />

      {/* 2. Trending AI Tools (backend-dynamic, recency-weighted) */}
      <DiscoveryRail
        eyebrow="Trending"
        title="Trending AI tools right now"
        description="Ranked by real engagement this week — views, saves, and comparisons across the catalog."
        tools={trendingTools}
        viewAllHref="/search?sort=popular"
      />

      {/* Most Saved */}
      <DiscoveryRail
        eyebrow="Most Saved"
        title="Most saved by the community"
        description="The tools people bookmark most to come back to."
        tools={mostSaved}
      />

      {/* Curated collections strip */}
      {collections.length > 0 ? (
        <FadeInSection>
          <SectionHeading
            eyebrow="Collections"
            title="Expert-curated collections"
            description="Hand-picked, editorial roundups for specific goals and audiences."
            action={
              <Button href="/collections" variant="outline">
                All collections →
              </Button>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className={cardClass({ hover: true })}
              >
                <span aria-hidden className="text-2xl">
                  {collection.emoji}
                </span>
                <p className="text-heading-2 mt-3 text-text-primary">{collection.title}</p>
                <p className="text-body mt-2 text-text-secondary">{collection.tagline}</p>
              </Link>
            ))}
          </div>
        </FadeInSection>
      ) : null}

      {/* 3. AI Categories (+ comparisons) */}
      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <FadeInSection className={cardClass({ padding: "lg", radius: "card-lg" })}>
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
        </FadeInSection>
        <div>
          <FadeInSection delay={0.05} className={`mb-6 ${cardClass({ padding: "lg", radius: "card-lg" })}`}>
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
                  className="flex flex-col gap-2 rounded-sm border border-border-subtle bg-surface-1 p-5 transition hover:border-border-accent hover:bg-surface-3"
                >
                  <span className="font-semibold text-text-primary">{comparison.title}</span>
                  <span className="text-body text-text-secondary">{comparison.summary}</span>
                </Link>
              ))}
              <Link
                href="/compare"
                className="block rounded-sm border border-border-accent bg-brand-cyan/8 p-4 text-center text-sm font-semibold text-brand-cyan-strong transition hover:bg-brand-cyan/12"
              >
                View all {liveComparisons.length} comparisons →
              </Link>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.1} className={cardClass({ padding: "lg", radius: "card-lg" })}>
            <p className="text-eyebrow mb-4 text-brand-cyan-strong">People Also Ask</p>
            <div className="space-y-3">
              {(blogSuggestionFAQs["50-chatgpt-prompts-save-hours"] || []).map((faq) => (
                <Link
                  key={faq.question}
                  href={`/blog/${faq.relatedSlug}`}
                  className="group flex items-start gap-3 rounded-sm border border-border-subtle bg-surface-1 p-4 transition hover:border-border-accent hover:bg-surface-3"
                >
                  <span className="mt-1 shrink-0 text-brand-cyan-strong">▸</span>
                  <p className="text-sm text-text-secondary transition group-hover:text-text-primary">
                    {faq.question}
                  </p>
                </Link>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 4. Recently Added Tools */}
      <FadeInSection>
        <SectionHeading
          eyebrow="Fresh"
          title="Recently added and verified"
          description="Newly verified catalog entries, sorted by the most recent verification date."
        />
        <StaggerGrid className="grid gap-6 lg:grid-cols-3">
          {recentlyAddedTools.map((tool) => (
            <StaggerItem key={tool.slug}>
              <ToolCard tool={tool} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </FadeInSection>

      {/* 5. AI Workflow Explorer */}
      <FadeInSection>
        <SectionHeading
          eyebrow="Workflow Explorer"
          title="Built for every operator"
          description="Pick the role closest to yours and jump straight to a shortlist tuned for that workflow."
        />
        <StaggerGrid className="grid gap-5 sm:grid-cols-3">
          {aiFinderOptions.map((option) => (
            <StaggerItem key={option.title}>
              <HoverLift>
                <Link
                  href={`/?recommend=${encodeURIComponent(option.query)}#ai-finder`}
                  className={`group block bg-gradient-to-br ${option.accent} ${cardClass({ hover: true, padding: "lg" })}`}
                >
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${option.iconClass}`}
                    aria-hidden
                  >
                    <WorkflowIcon name={option.icon} />
                  </span>
                  <h3 className="mt-4 font-semibold text-text-primary">{option.title}</h3>
                  <p className="text-body mt-2 text-text-secondary">{option.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-cyan-strong">
                    Explore tools
                    <span aria-hidden className="transition group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </FadeInSection>

      {/* 6. Expert Recommendations */}
      {researchRecommendations.length > 0 ? (
        <DiscoveryRail
          eyebrow="Recommended from catalog"
          title="Tell us the job, get an AI shortlist"
          description="The finder scores tools against user intent, categories, audiences, tags, platforms, and pricing metadata."
          tools={researchRecommendations}
        />
      ) : null}

      {/* 7. Editorial Insights */}
      <FadeInSection>
        <SectionHeading
          eyebrow="Editorial Insights"
          title="AI guides, tips, and industry coverage"
          description="Long-form guides from our editorial desk, plus short AI-assisted news summaries that link back to original publishers."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group ${cardClass({ hover: true })}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="brand">{post.category}</Badge>
                <span className="text-caption text-text-muted">{post.readTime}</span>
              </div>
              <h3 className="font-semibold text-text-primary transition group-hover:text-brand-cyan-strong">
                {post.title}
              </h3>
              <p className="text-body mt-3 text-text-secondary">{post.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <time className="text-caption text-text-muted">{post.publishedAt}</time>
                <span className="text-sm text-brand-cyan-strong group-hover:underline">Read →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href="/blog" variant="outline">
            View all blog posts →
          </Button>
        </div>

        {newsArticles.length > 0 ? (
          <div className="mt-12">
            <EditorialBlock eyebrow="AI News" title="Enterprise AI news, summarized with attribution">
              We only display summaries, excerpts, and source metadata here. Readers should use the
              original links for the complete article and publisher context.
            </EditorialBlock>
            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {newsArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            <div className="mt-6">
              <Button href="/news" variant="outline">
                Explore the full AI news desk
              </Button>
            </div>
          </div>
        ) : null}
      </FadeInSection>

      {/* Curated lists + creative tools */}
      <FadeInSection>
        <SectionHeading
          eyebrow="Best Of"
          title="Curated AI tool lists"
          description="Hand-picked lists by use case, category, and audience — built from real catalog data."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {liveBestLists.map((list) => (
            <Link key={list.slug} href={`/best/${list.slug}`} className={cardClass({ hover: true })}>
              <span className="text-caption text-brand-cyan-strong">{list.eyebrow}</span>
              <p className="mt-2 font-semibold text-text-primary">{list.title}</p>
              <p className="text-body mt-2 text-text-secondary">{list.description}</p>
            </Link>
          ))}
        </div>
      </FadeInSection>

      <FadeInSection>
        <SectionHeading
          eyebrow="Creative"
          title="Image, design, and video tools in one view"
          description="Creative teams can explore image generation, design assistance, and video production tools from the live catalog."
        />
        <StaggerGrid className="grid gap-6 lg:grid-cols-3">
          {creativeTools.map((tool) => (
            <StaggerItem key={tool.slug}>
              <ToolCard tool={tool} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </FadeInSection>

      {/* 8. Newsletter / community */}
      <FadeInSection>
        <div className={`${cardClass({ padding: "lg", radius: "card-lg", glow: "violet" })} flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between`}>
          <div className="flex items-center gap-4">
            <FaviconBadge
              name="AiverseWorld"
              faviconUrl="/logo.webp"
              className="hidden h-12 w-12 shrink-0 rounded-2xl sm:flex"
            />
            <div>
              <p className="text-eyebrow text-brand-cyan-strong">Join the community</p>
              <h2 className="text-heading-1 mt-2 text-text-primary">
                Get the best new AI tools in your inbox
              </h2>
              <p className="text-body mt-2 max-w-xl text-text-secondary">
                One email a week: new launches, category deep-dives, and shortlist-worthy tools our
                editors verified.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-auto lg:min-w-[22rem]">
            <NewsletterSignup />
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}
