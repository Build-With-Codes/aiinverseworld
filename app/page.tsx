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
import { getToolCatalog } from "@/lib/tool-catalog";
import { getRouteSeo } from "@/services/seo.service";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata(getRouteSeo("/"));

const REVALIDATE_SECONDS = 300;

export default function Home() {
  return (
    <div className="space-y-20 pb-14 pt-10">
      <section className="relative grid gap-12 overflow-hidden py-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-12">
        <div className="relative space-y-8">
          <FadeInSection>
            <Badge variant="brand">Enterprise-grade AI discovery</Badge>
          </FadeInSection>
          <FadeInSection delay={0.05} className="space-y-6">
            <h1 className="text-display-1 max-w-5xl text-text-primary">
              Discover, Compare, and Choose the Best AI Tools
            </h1>
            <p className="text-body-lg max-w-2xl text-text-secondary">
              AiverseWorld helps teams discover verified AI tools, compare real product options,
              and use private prompt utilities without turning research into a messy directory hunt.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <HeroSearch />
          </FadeInSection>

          <Suspense fallback={null}>
            <TrendingQueryChips />
          </Suspense>
        </div>

        <FadeInSection delay={0.15} className="relative">
          <AiPlatformVisualization />
        </FadeInSection>
      </section>

      <FadeInSection>
        <TrustedStatsSection />
      </FadeInSection>

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
      <EnterprisePlatformSection />
      <PrivacyAndFAQSection />

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
    <div className="relative min-h-[28rem] overflow-hidden rounded-card-lg bg-gradient-to-br from-brand-electric/10 via-surface-2 to-brand-violet/10 p-6 lg:p-8">
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-pill border border-border-accent bg-surface-glass backdrop-blur" />
      <div className="absolute inset-8 rounded-pill border border-border-subtle" />
      <div className="relative flex min-h-[24rem] flex-col justify-between">
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
            <div key={name} className="rounded-sm bg-surface-glass px-3 py-2 backdrop-blur">
              <p className="text-sm font-semibold text-text-primary">{name}</p>
              <p className="text-xs text-text-muted">{category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrustedStatsSection() {
  const stats = [
    ["140+", "Verified AI tools"],
    ["40+", "Practical categories"],
    ["500+", "Comparison paths"],
    ["Daily", "Catalog updates"],
  ];

  return (
    <section aria-label="AiverseWorld platform statistics" className="border-y border-border-subtle py-8">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label}>
            <p className="text-display-2 text-text-primary">{value}</p>
            <p className="mt-1 text-sm font-medium text-text-secondary">{label}</p>
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
  const catalog = await getToolCatalog(1, REVALIDATE_SECONDS);
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
    "Token counter",
    "Cost calculator",
    "Prompt formatter",
    "Prompt cleaner",
    "System prompts",
    "Image prompts",
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
              key={module}
              href="/prompt-tools"
              className={cardClass({ hover: true, padding: "md" })}
            >
              <p className="text-sm font-semibold text-text-primary">{module}</p>
              <p className="mt-2 text-xs text-text-muted">Private, free, browser-only</p>
            </Link>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

function EnterprisePlatformSection() {
  const features = [
    "Verified AI tool profiles",
    "Fast category and intent search",
    "Human-curated collections",
    "Comparison-ready product data",
    "Prompt workflows for teams",
    "Fresh editorial coverage",
  ];

  return (
    <FadeInSection>
      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-eyebrow text-brand-violet-strong">Enterprise platform</p>
          <h2 className="text-display-2 mt-3 text-text-primary">
            A calmer way to evaluate the AI stack your team depends on
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-3 rounded-sm py-2">
              <span className="h-2 w-2 rounded-pill bg-brand-electric" aria-hidden />
              <span className="font-medium text-text-secondary">{feature}</span>
            </div>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}

function PrivacyAndFAQSection() {
  const faqs = [
    {
      question: "How does AiverseWorld choose tools?",
      answer:
        "We organize tools by use case, category, audience, platform, pricing signals, and editorial review so buyers can shortlist faster.",
    },
    {
      question: "Are prompt tools private?",
      answer:
        "The prompt utilities use browser-side logic for counting, formatting, cleaning, and estimating after the page loads.",
    },
    {
      question: "Can teams use it for research?",
      answer:
        "Yes. Discovery, comparisons, collections, and prompt tools are structured for repeatable AI evaluation workflows.",
    },
  ];

  return (
    <FadeInSection>
      <section className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-eyebrow text-brand-electric-strong">Privacy and clarity</p>
          <h2 className="text-display-2 mt-3 text-text-primary">Built for useful research, not noise</h2>
          <p className="text-body-lg mt-4 text-text-secondary">
            AiverseWorld keeps the public experience fast, readable, and focused on decision-making.
          </p>
        </div>
        <div className="divide-y divide-border-subtle">
          {faqs.map((item) => (
            <article key={item.question} className="py-5 first:pt-0 last:pb-0">
              <h3 className="text-heading-2 text-text-primary">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </FadeInSection>
  );
}
