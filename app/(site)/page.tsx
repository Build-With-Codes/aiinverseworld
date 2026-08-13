import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CategoryCard } from "@/components/category-card";
import { FaviconBadge } from "@/components/favicon-badge";
import { HeroSearch } from "@/components/hero-search";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/tool-card";
import { DiscoveryRail } from "@/components/engagement/discovery-rail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
import { FadeInSection, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import { getRankings } from "@/lib/engagement";
import { finderQuestions } from "@/lib/home-content";
import { buildMetadata } from "@/lib/seo/metadata";
import { getCategories, getComparisons, getToolCatalog } from "@/lib/tool-catalog";
import { getRouteSeo } from "@/services/seo.service";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata(getRouteSeo("/"));

const REVALIDATE_SECONDS = 300;

export default function Home() {
  return (
    <div className="space-y-12 pb-14 pt-8">
      <section className="relative grid gap-12 overflow-hidden py-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-12">
        <div className="relative space-y-8">
          {/* No FadeInSection here: this content is always above the fold and
              visible on first paint, so gating it behind an IntersectionObserver
              reveal only delays LCP for no visual benefit — confirmed via
              Lighthouse's LCP breakdown (1.2s+ element render delay on the h1
              while wrapped). Below-fold sections keep the scroll-reveal effect,
              where it's actually earned. */}
          <Badge variant="brand">Enterprise-grade AI discovery</Badge>
          <div className="space-y-6">
            <h1 className="text-display-1 max-w-5xl text-text-primary">
              Discover, Compare, and Choose the Best AI Tools
            </h1>
            <p className="text-body-lg max-w-2xl text-text-secondary">
              AiverseWorld helps teams discover verified AI tools, compare real product options,
              and use private prompt utilities without turning research into a messy directory hunt.
            </p>
          </div>

          <FadeInSection delay={0.1}>
            <Suspense fallback={<HeroSearchFallback />}>
              <HeroSearch />
            </Suspense>
          </FadeInSection>

          <Suspense fallback={null}>
            <TrendingQueryChips />
          </Suspense>
        </div>

        <FadeInSection delay={0.15} className="relative">
          <AiPlatformVisualization />
        </FadeInSection>
      </section>

      <Suspense fallback={<StatsFallback />}>
        <TrustedStatsSection />
      </Suspense>

      <Suspense fallback={<RailFallback />}>
        <FeaturedToolsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback rows={2} />}>
        <PopularCategoriesSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <RecentlyAddedSection />
      </Suspense>

      <PromptStudioSection />
      <FaqTeaserSection />

      <FadeInSection>
        <section className="rounded-card-lg border border-border-accent bg-gradient-to-r from-brand-electric/12 via-brand-violet/10 to-transparent p-7 lg:p-10">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <FaviconBadge
                name="AiverseWorld"
                faviconUrl="/logo.webp"
                className="hidden h-12 w-12 shrink-0 rounded-2xl sm:flex"
              />
              <div>
                <p className="text-eyebrow text-brand-electric-strong">Join the community</p>
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
        </section>
      </FadeInSection>
    </div>
  );
}

function HeroSearchFallback() {
  return (
    <div
      aria-hidden
      className="home-ai-finder rounded-[32px] bg-surface-3/82 p-4 shadow-[0_24px_120px_rgba(8,15,35,0.34)] backdrop-blur-2xl"
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-h-[60px] animate-pulse rounded-2xl bg-surface-2" />
        <div className="min-h-[60px] w-full animate-pulse rounded-full bg-surface-2 sm:w-40" />
      </div>
    </div>
  );
}

function SectionFallback({ rows = 1 }: { rows?: number }) {
  return (
    <section className="space-y-4" aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="min-h-28 animate-pulse rounded-card-lg border border-border-subtle bg-surface-1"
        />
      ))}
    </section>
  );
}

function RailFallback() {
  return (
    <section className="space-y-4" aria-hidden>
      <div className="h-6 w-48 animate-pulse rounded-full bg-surface-2" />
      <div className="grid gap-5 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-52 animate-pulse rounded-card-lg border border-border-subtle bg-surface-1"
          />
        ))}
      </div>
    </section>
  );
}

function StatsFallback() {
  return (
    <section
      aria-label="AiverseWorld platform statistics loading"
      className="rounded-card-lg border border-border-subtle bg-gradient-to-br from-surface-2 via-surface-1 to-surface-2 px-5 py-5 shadow-[0_18px_70px_rgba(2,6,23,0.14)] sm:px-7 lg:px-8 dark:border-white/10 dark:bg-[#07101f] dark:from-[#07101f] dark:via-[#081222] dark:to-[#06101d] dark:shadow-[0_18px_70px_rgba(2,6,23,0.22)]"
    >
      <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`space-y-3 py-4 sm:px-5 lg:px-8 ${
              index > 0 ? "lg:border-l lg:border-border-subtle dark:lg:border-white/10" : ""
            } ${index % 2 === 1 ? "sm:border-l sm:border-border-subtle dark:sm:border-white/10 lg:border-l" : ""}`}
          >
            <div className="skeleton-shimmer h-12 w-12 rounded-card" />
            <div className="skeleton-shimmer h-11 w-24 rounded-pill" />
            <div className="skeleton-shimmer h-4 w-36 rounded-pill" />
          </div>
        ))}
      </div>
    </section>
  );
}

function StatIcon({ index }: { index: number }) {
  const iconClass = "h-6 w-6";
  if (index === 1) {
    return (
      <svg aria-hidden className={iconClass} viewBox="0 0 24 24" fill="none">
        <path d="M4.75 5.75h5.5v5.5h-5.5v-5.5Zm9 0h5.5v5.5h-5.5v-5.5Zm-9 7h5.5v5.5h-5.5v-5.5Zm9 0h5.5v5.5h-5.5v-5.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg aria-hidden className={iconClass} viewBox="0 0 24 24" fill="none">
        <path d="M7.5 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm9 14a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0-14a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM9.6 6.4l4.8 10.2M14.4 6.4 9.6 11.6m0 0 4.8 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg aria-hidden className={iconClass} viewBox="0 0 24 24" fill="none">
        <path d="M5 14.5 14.5 5l4.5 4.5-9.5 9.5H5v-4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="m13.5 6 4.5 4.5M7 17l-2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg aria-hidden className={iconClass} viewBox="0 0 24 24" fill="none">
      <path d="M12 3.75 18.25 6v5.25c0 4.15-2.52 7.6-6.25 9-3.73-1.4-6.25-4.85-6.25-9V6L12 3.75Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9.25 12 1.8 1.8 3.9-4.05" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

async function TrendingQueryChips() {
  const mostSearchedTools = await getRankings("most-searched", 6, REVALIDATE_SECONDS);
  const trendingQueries = mostSearchedTools.map((tool) => tool.name);
  if (trendingQueries.length === 0) return null;

  return (
    <FadeInSection delay={0.12} className="flex flex-wrap items-center gap-2">
      <span className="flex shrink-0 items-center gap-2 rounded-full border border-border-accent bg-brand-electric/10 px-3 py-1.5 text-brand-electric-strong">
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
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
          <span className="mt-0.5 text-text-muted">now</span>
        </span>
      </span>
      {trendingQueries.map((item) => (
        <Link
          key={item}
          href={`/search?q=${encodeURIComponent(item)}`}
          className="shrink-0 rounded-full border border-border-subtle bg-surface-2 px-3 py-1.5 text-xs font-medium text-text-secondary transition hover:border-border-accent hover:bg-brand-electric/10 hover:text-text-primary"
        >
          {item}
        </Link>
      ))}
    </FadeInSection>
  );
}

function AiPlatformVisualization() {
  const tools = [
    ["ChatGPT", "Reasoning"],
    ["Claude", "Research"],
    ["Gemini", "Multimodal"],
    ["Cursor", "Coding"],
    ["Midjourney", "Image"],
    ["Runway", "Video"],
    ["Perplexity", "Search"],
  ];

  return (
    <div className="relative min-h-[20rem] overflow-hidden rounded-card-lg bg-gradient-to-br from-brand-electric/10 via-surface-2 to-brand-violet/10 p-6 lg:min-h-[28rem] lg:p-8">
      <div className="absolute left-1/2 top-1/2 hidden h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-pill border border-border-accent bg-surface-glass backdrop-blur lg:block" />
      <div className="absolute inset-8 hidden rounded-pill border border-border-subtle lg:block" />
      <div className="relative flex min-h-[18rem] flex-col justify-between gap-6 lg:min-h-[24rem]">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-eyebrow text-brand-electric-strong">AI Finder</p>
            <h2 className="text-heading-1 mt-3 max-w-sm text-text-primary">
              Describe the job. Get the shortlist.
            </h2>
          </div>
          <Button href="#ai-finder" variant="secondary">
            Try AI Finder
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {finderQuestions.slice(0, 4).map((question) => (
            <Link
              key={question.label}
              href={`/?recommend=${encodeURIComponent(question.query)}#ai-finder`}
              className="group rounded-card bg-surface-glass px-4 py-3 backdrop-blur transition duration-[var(--motion-hover)] hover:-translate-y-0.5 hover:bg-surface-3"
            >
              <span className="block text-sm font-semibold text-text-primary">{question.label}</span>
              <span className="mt-1 block text-xs text-brand-electric-strong">Find recommended tools</span>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tools.slice(0, 4).map(([name, category]) => (
            <Link
              key={name}
              href={`/search?q=${encodeURIComponent(name)}`}
              prefetch={false}
              className="group rounded-sm bg-surface-glass px-3 py-2 backdrop-blur transition hover:bg-surface-3"
            >
              <p className="text-sm font-semibold text-text-primary group-hover:text-brand-electric-strong">
                {name}
              </p>
              <p className="text-xs text-text-muted">{category}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatStatCount(value: number) {
  if (value <= 0) {
    return "Live";
  }

  if (value >= 1000) {
    return `${Math.floor(value / 1000)}k+`;
  }

  return `${value}+`;
}

async function TrustedStatsSection() {
  const [catalog, categoryCatalog, comparisonCatalog] = await Promise.all([
    getToolCatalog(1, REVALIDATE_SECONDS),
    getCategories(REVALIDATE_SECONDS),
    getComparisons(500, REVALIDATE_SECONDS),
  ]);

  const stats = [
    {
      value: formatStatCount(catalog.pagination.total),
      label: "Verified AI tools",
      description: "Handpicked and tested for quality",
      accent: "border-brand-violet/25 bg-brand-violet/15 text-brand-violet",
    },
    {
      value: formatStatCount(categoryCatalog.categories.length),
      label: "Practical categories",
      description: "From productivity to creativity and more",
      accent: "border-brand-electric/25 bg-brand-electric/15 text-brand-electric-strong",
    },
    {
      value: formatStatCount(comparisonCatalog.comparisons.length),
      label: "Comparison paths",
      description: "Find the perfect tool for your needs",
      accent: "border-brand-violet/25 bg-brand-violet/15 text-brand-violet",
    },
    {
      value: "Daily",
      label: "Catalog updates",
      description: "Fresh tools, trends, and insights every day",
      accent: "border-brand-cyan/25 bg-brand-cyan/15 text-brand-cyan-strong",
    },
  ];

  return (
    <section
      aria-label="AiverseWorld platform statistics"
      className="relative overflow-hidden rounded-card-lg border border-border-subtle bg-gradient-to-br from-surface-2 via-surface-1 to-surface-2 px-5 py-5 shadow-[0_22px_80px_rgba(2,6,23,0.12)] sm:px-7 lg:px-8 dark:border-white/10 dark:bg-[#07101f] dark:from-[#07101f] dark:via-[#081222] dark:to-[#06101d] dark:shadow-[0_22px_80px_rgba(2,6,23,0.28)]"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.14),transparent_62%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.26),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_100%_10%,rgba(34,211,238,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_100%_10%,rgba(34,211,238,0.14),transparent_60%)]" />
      <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`relative px-1 py-4 sm:px-5 lg:px-8 ${
              index > 0 ? "lg:border-l lg:border-border-subtle dark:lg:border-white/10" : ""
            } ${index % 2 === 1 ? "sm:border-l sm:border-border-subtle dark:sm:border-white/10 lg:border-l" : ""}`}
          >
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-card border shadow-[0_14px_34px_rgba(2,6,23,0.24)] ${stat.accent}`}>
              <StatIcon index={index} />
            </div>
            <p className="text-[2.6rem] font-bold leading-none tracking-normal text-text-primary sm:text-[2.9rem]">
              {stat.value}
            </p>
            <h2 className="mt-2 text-base font-bold leading-6 text-text-primary">{stat.label}</h2>
            <p className="mt-1 max-w-48 text-sm leading-6 text-text-secondary">{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

async function FeaturedToolsSection() {
  const catalog = await getToolCatalog(6, REVALIDATE_SECONDS);
  return (
    <DiscoveryRail
      eyebrow="Featured"
      title="Featured AI tools this month"
      description="Editorially highlighted tools worth shortlisting first, based on category strength, pricing clarity, and real-world adoption."
      tools={catalog.tools.slice(0, 6)}
      viewAllHref="/search"
    />
  );
}

async function PopularCategoriesSection() {
  const catalog = await getCategories(REVALIDATE_SECONDS);
  const topCategories = [...catalog.categories].sort((a, b) => b.count - a.count).slice(0, 6);

  return (
    <FadeInSection>
      <SectionHeading
        eyebrow="Popular Categories"
        title="Start with the kind of AI work you need"
        description="Move from broad discovery to a focused shortlist with categories organized around real use cases."
        action={
          <Button href="/category" variant="outline">
            All categories
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topCategories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </FadeInSection>
  );
}

async function RecentlyAddedSection() {
  const catalog = await getToolCatalog(80, REVALIDATE_SECONDS);
  const recentlyAddedTools = [...catalog.tools]
    .sort((a, b) => new Date(b.lastVerified).getTime() - new Date(a.lastVerified).getTime())
    .slice(0, 6);

  return (
    <FadeInSection>
      <SectionHeading
        eyebrow="Recently Added"
        title="Freshly verified AI tools"
        description="New catalog entries and updates, sorted by the most recent verification date."
      />
      <StaggerGrid className="grid gap-6 lg:grid-cols-3">
        {recentlyAddedTools.map((tool) => (
          <StaggerItem key={tool.slug}>
            <ToolCard tool={tool} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </FadeInSection>
  );
}

function PromptStudioSection() {
  const modules = [
    { label: "Token counter", href: "/prompt-tools/token-counter" },
    { label: "Cost calculator", href: "/prompt-tools/cost-calculator" },
    { label: "Prompt formatter", href: "/prompt-tools/prompt-formatter" },
    { label: "Prompt cleaner", href: "/prompt-tools/prompt-cleaner" },
    { label: "System prompts", href: "/prompt-tools/system-prompt-builder" },
    { label: "Template builder", href: "/prompt-tools/template-builder" },
  ];

  return (
    <FadeInSection>
      <section className="grid gap-10 border-y border-border-subtle py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div>
          <p className="text-eyebrow text-brand-violet-strong">Prompt Studio</p>
          <h2 className="text-display-2 mt-3 text-text-primary">
            Free browser-only prompt tools for serious AI workflows
          </h2>
          <p className="text-body-lg mt-4 max-w-2xl text-text-secondary">
            Count tokens, estimate costs, format prompts, clean drafts, and build model-ready
            instructions locally in the browser after the page loads.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/prompt-tools" size="lg">
              Open Prompt Tools
            </Button>
            <Button href="/prompt-tools/token-counter" variant="secondary" size="lg">
              Start with Token Counter
            </Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {modules.map((module) => (
            <Link
              key={module.label}
              href={module.href}
              className={cardClass({ hover: true, padding: "md" })}
            >
              <p className="text-sm font-semibold text-text-primary">{module.label}</p>
              <p className="mt-2 text-xs text-text-muted">Private, free, browser-only</p>
            </Link>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

function FaqTeaserSection() {
  return (
    <FadeInSection>
      <section className="flex flex-col items-start justify-between gap-4 border-t border-border-subtle pt-10 sm:flex-row sm:items-center">
        <div>
          <p className="text-eyebrow text-brand-electric-strong">Privacy and clarity</p>
          <h2 className="text-heading-1 mt-2 text-text-primary">
            Built for useful research, not noise
          </h2>
          <p className="text-body mt-2 max-w-xl text-text-secondary">
            How we choose tools, what stays private in the prompt tools, and how teams use
            AiverseWorld for repeatable evaluation.
          </p>
        </div>
        <Button href="/faq" variant="outline" className="shrink-0">
          Read the FAQ
        </Button>
      </section>
    </FadeInSection>
  );
}
