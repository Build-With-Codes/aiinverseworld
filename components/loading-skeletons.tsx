import Link from "next/link";

import { getAllBlogPosts } from "@/lib/blog-data";
import { aiFinderOptions, discoveryBands, finderQuestions } from "@/lib/home-content";

type SkeletonBlockProps = {
  className?: string;
};

function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
  return <div className={`skeleton-shimmer ${className}`} />;
}

function SkeletonLine({ className = "" }: SkeletonBlockProps) {
  return <SkeletonBlock className={`h-3 rounded-full ${className}`} />;
}

export function PageShellSkeleton({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`space-y-10 pb-10 ${compact ? "pt-10" : "pt-10 sm:pt-14"}`}
      aria-busy="true"
      aria-live="polite"
    >
      {children}
    </div>
  );
}

export function HeroSkeleton({ split = true }: { split?: boolean }) {
  return (
    <section className={split ? "grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end" : "space-y-7"}>
      <div className="space-y-6">
        <SkeletonBlock className="h-9 w-44 rounded-full" />
        <div className="space-y-4">
          <SkeletonLine className="h-12 w-full max-w-3xl sm:h-14" />
          <SkeletonLine className="h-12 w-4/5 max-w-2xl sm:h-14" />
          <SkeletonLine className="h-5 w-full max-w-2xl" />
          <SkeletonLine className="h-5 w-3/4 max-w-xl" />
        </div>
        <div className="flex flex-wrap gap-3">
          <SkeletonBlock className="h-12 w-36 rounded-2xl" />
          <SkeletonBlock className="h-12 w-32 rounded-2xl" />
        </div>
      </div>

      {split ? (
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-7">
          <SkeletonLine className="w-40" />
          <div className="mt-6 space-y-4">
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-5/6" />
            <SkeletonLine className="w-4/6" />
          </div>
          <div className="mt-7 grid grid-cols-3 gap-3">
            <SkeletonBlock className="h-20 rounded-2xl" />
            <SkeletonBlock className="h-20 rounded-2xl" />
            <SkeletonBlock className="h-20 rounded-2xl" />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function FilterBarSkeleton() {
  return (
    <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
      <SkeletonLine className="w-32" />
      <SkeletonLine className="mt-4 h-8 w-full max-w-xl" />
      <SkeletonLine className="mt-3 w-full max-w-2xl" />
      <SkeletonBlock className="mt-7 h-14 rounded-2xl" />
      <div className="mt-4 flex flex-wrap gap-3">
        <SkeletonBlock className="h-11 w-32 rounded-2xl" />
        <SkeletonBlock className="h-11 w-28 rounded-2xl" />
        <SkeletonBlock className="h-11 w-32 rounded-2xl" />
        <SkeletonBlock className="h-11 w-28 rounded-2xl" />
      </div>
    </section>
  );
}

export function ToolGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(4,10,25,0.18)]"
        >
          <div className="flex items-start gap-4">
            <SkeletonBlock className="h-14 w-14 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1 space-y-3">
              <SkeletonLine className="h-5 w-3/5" />
              <SkeletonLine className="w-2/5" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-11/12" />
            <SkeletonLine className="w-4/6" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <SkeletonBlock className="h-8 w-20 rounded-full" />
            <SkeletonBlock className="h-8 w-24 rounded-full" />
            <SkeletonBlock className="h-8 w-16 rounded-full" />
          </div>
        </article>
      ))}
    </section>
  );
}

export function CategoryGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="rounded-[28px] border border-white/10 bg-white/6 p-6">
          <SkeletonBlock className="h-11 w-11 rounded-2xl" />
          <SkeletonLine className="mt-5 h-6 w-3/5" />
          <SkeletonLine className="mt-4 w-full" />
          <SkeletonLine className="mt-3 w-4/5" />
          <SkeletonBlock className="mt-6 h-9 w-24 rounded-full" />
        </article>
      ))}
    </section>
  );
}

export function ProblemGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="rounded-[28px] border border-white/10 bg-white/6 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <SkeletonLine className="w-28" />
              <SkeletonLine className="h-7 w-4/5" />
            </div>
            <SkeletonBlock className="h-12 w-16 rounded-2xl" />
          </div>
          <div className="mt-6 space-y-3">
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-11/12" />
            <SkeletonLine className="w-3/4" />
          </div>
          <SkeletonBlock className="mt-6 h-20 rounded-2xl" />
          <div className="mt-6 flex justify-between">
            <SkeletonLine className="w-24" />
            <SkeletonLine className="w-20" />
          </div>
        </article>
      ))}
    </section>
  );
}

export function CompareSkeleton() {
  return (
    <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <SkeletonBlock className="h-14 rounded-2xl" />
        <SkeletonBlock className="h-10 w-10 rounded-full" />
        <SkeletonBlock className="h-14 rounded-2xl" />
      </div>
      <div className="mt-8 overflow-hidden rounded-[26px] border border-white/10">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 border-b border-white/10 p-4 last:border-b-0">
            <SkeletonLine className="w-3/4" />
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-11/12" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DetailSkeleton() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <div className="flex items-center gap-4">
          <SkeletonBlock className="h-16 w-16 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <SkeletonLine className="h-8 w-2/3" />
            <SkeletonLine className="w-1/2" />
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-11/12" />
          <SkeletonLine className="w-3/4" />
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <SkeletonBlock className="h-24 rounded-2xl" />
          <SkeletonBlock className="h-24 rounded-2xl" />
        </div>
      </div>
      <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SkeletonLine className="w-36" />
        <SkeletonBlock className="mt-6 h-14 rounded-2xl" />
        <SkeletonBlock className="mt-4 h-14 rounded-2xl" />
        <SkeletonBlock className="mt-8 h-40 rounded-3xl" />
      </div>
    </section>
  );
}

export function NewsGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <article key={index} className="rounded-[28px] border border-white/10 bg-white/6 p-6">
          <SkeletonBlock className="h-44 rounded-3xl" />
          <SkeletonLine className="mt-6 h-6 w-4/5" />
          <SkeletonLine className="mt-4 w-full" />
          <SkeletonLine className="mt-3 w-5/6" />
          <div className="mt-6 flex justify-between">
            <SkeletonLine className="w-24" />
            <SkeletonLine className="w-20" />
          </div>
        </article>
      ))}
    </section>
  );
}

export function HomePageSkeleton() {
  const blogPosts = getAllBlogPosts().slice(0, 6);

  return (
    <PageShellSkeleton>
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-cyan-100 uppercase">
            Enterprise-grade AI discovery
          </div>
          <div className="space-y-6">
            <div className="max-w-5xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Discover the Perfect AI Tool
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              AiverseWorld is your curated search engine for AI products across
              assistants, coding, video, research, automation, and enterprise
              platforms. Compare real tools, pricing signals, and use cases fast.
            </p>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-white/8 p-4 shadow-[0_24px_120px_rgba(8,15,35,0.45)] backdrop-blur-2xl">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="rounded-2xl border border-white/10 bg-[#071120] px-5 py-4 text-sm text-slate-500">
                Search AI tools by use case, price, or category
              </div>
              <div className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-semibold text-slate-950">
                Recommend AI
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["AI for Sales", "Free Image Tools", "Code Assistants", "Education"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                <SkeletonLine className="h-8 w-16" />
                <SkeletonLine className="mt-4 w-28" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[32px] border border-cyan-300/18 bg-white/6 p-7">
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
                  className="block rounded-2xl border border-white/8 bg-white/5 p-4"
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
        <div className="flex gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-16 min-w-44 rounded-2xl" />
          ))}
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-16 min-w-44 rounded-2xl" />
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold tracking-[0.28em] text-cyan-200 uppercase">Learning Hub</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          AI Guides, Tips & Insights
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          Learn how to master AI tools, discover best practices, and stay updated with the latest AI trends and strategies.
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-[24px] border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/30 hover:bg-white/8"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded bg-cyan-300/10 px-2 py-1 text-xs font-medium text-cyan-200">
                {post.category}
              </span>
              <span className="text-xs text-slate-500">{post.readTime}</span>
            </div>
            <h3 className="line-clamp-2 font-semibold text-white transition group-hover:text-cyan-200">
              {post.title}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm text-slate-400">
              {post.description}
            </p>
          </Link>
        ))}
      </section>

      <SectionHeaderSkeleton />
      <ToolGridSkeleton count={6} />
    </PageShellSkeleton>
  );
}

export function ToolDetailPageSkeleton() {
  return (
    <PageShellSkeleton>
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <div className="flex flex-wrap items-center gap-3">
            <SkeletonBlock className="h-12 w-12 rounded-2xl" />
            <SkeletonBlock className="h-8 w-32 rounded-full" />
            <SkeletonBlock className="h-8 w-28 rounded-full" />
            <SkeletonBlock className="h-8 w-24 rounded-full" />
          </div>
          <SkeletonLine className="mt-7 h-12 w-2/3" />
          <SkeletonLine className="mt-4 w-48" />
          <SkeletonLine className="mt-6 h-5 w-full max-w-3xl" />
          <SkeletonLine className="mt-3 h-5 w-4/5 max-w-2xl" />
          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-7 w-20 rounded-full" />
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <SkeletonBlock className="h-12 w-32 rounded-2xl" />
            <SkeletonBlock className="h-12 w-32 rounded-2xl" />
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[24px] border border-white/10 bg-[#081222] p-5">
                <SkeletonLine className="w-24" />
                <SkeletonLine className="mt-4 h-5 w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <SectionHeaderSkeleton compact />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-14 rounded-[22px]" />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[30px] border border-white/10 bg-white/6 p-7">
            <SkeletonLine className="h-6 w-32" />
            <div className="mt-5 space-y-3">
              {[0, 1, 2, 3].map((item) => (
                <SkeletonBlock key={item} className="h-12 rounded-2xl" />
              ))}
            </div>
          </div>
        ))}
      </section>

      <SectionHeaderSkeleton />
      <ToolGridSkeleton count={3} />
    </PageShellSkeleton>
  );
}

export function BestListPageSkeleton() {
  return (
    <PageShellSkeleton>
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SkeletonBlock className="h-9 w-36 rounded-full" />
        <SkeletonLine className="mt-5 h-12 w-full max-w-3xl" />
        <SkeletonLine className="mt-4 h-5 w-full max-w-2xl" />
        <SkeletonLine className="mt-3 h-5 w-4/5 max-w-xl" />
        <div className="mt-5 flex flex-wrap gap-3">
          <SkeletonBlock className="h-8 w-24 rounded-full" />
          <SkeletonBlock className="h-8 w-32 rounded-full" />
          <SkeletonBlock className="h-8 w-36 rounded-full" />
        </div>
      </section>
      <ToolGridSkeleton count={9} />
      <PaginationSkeleton />
      <ExploreLinksSkeleton />
    </PageShellSkeleton>
  );
}

export function CategoryPageSkeleton({ list = false }: { list?: boolean }) {
  return (
    <PageShellSkeleton compact>
      <FilterBarSkeleton />
      {list ? <CategoryGridSkeleton count={9} /> : <ToolGridSkeleton count={9} />}
      <PaginationSkeleton />
    </PageShellSkeleton>
  );
}

export function ComparePageSkeleton({ detail = false }: { detail?: boolean }) {
  return (
    <PageShellSkeleton compact>
      {detail ? <HeroSkeleton split={false} /> : null}
      <CompareSkeleton />
      {!detail ? <ExploreLinksSkeleton /> : null}
    </PageShellSkeleton>
  );
}

export function ProblemsPageSkeleton() {
  return (
    <PageShellSkeleton>
      <HeroSkeleton />
      <SectionHeaderSkeleton />
      <FilterBarSkeleton />
      <ProblemGridSkeleton count={6} />
      <PaginationSkeleton />
    </PageShellSkeleton>
  );
}

export function NewsPageSkeleton() {
  return (
    <PageShellSkeleton>
      <HeroSkeleton />
      <SectionHeaderSkeleton />
      <NewsGridSkeleton count={9} />
    </PageShellSkeleton>
  );
}

export function TutorPageSkeleton() {
  return (
    <PageShellSkeleton>
      <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <div className="space-y-6">
          <SkeletonBlock className="h-9 w-60 rounded-full" />
          <SkeletonLine className="h-14 w-full max-w-2xl" />
          <SkeletonLine className="h-14 w-3/4 max-w-xl" />
          <SkeletonLine className="h-5 w-full max-w-2xl" />
          <div className="grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-white/6 p-5">
                <SkeletonLine className="h-8 w-16" />
                <SkeletonLine className="mt-4 w-24" />
              </div>
            ))}
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
            <SkeletonLine className="w-28" />
            <div className="mt-5 grid gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-14 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-[#071120]/90 p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="space-y-3">
              <SkeletonLine className="h-5 w-32" />
              <SkeletonLine className="w-56" />
            </div>
            <SkeletonBlock className="h-10 w-44 rounded-full" />
          </div>
          <div className="mt-4 h-[440px] space-y-4 overflow-hidden">
            {[0, 1, 2, 3].map((item) => (
              <SkeletonBlock
                key={item}
                className={`h-28 rounded-[24px] ${item % 2 === 0 ? "mr-auto w-4/5" : "ml-auto w-3/4"}`}
              />
            ))}
          </div>
          <SkeletonBlock className="mt-5 h-40 rounded-[24px]" />
        </div>
      </section>
    </PageShellSkeleton>
  );
}

function SectionHeaderSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "space-y-3" : "space-y-4"}>
      <SkeletonLine className="w-24" />
      <SkeletonLine className={`${compact ? "h-8" : "h-10"} w-full max-w-xl`} />
      <SkeletonLine className="w-full max-w-2xl" />
      <SkeletonLine className="w-3/4 max-w-xl" />
    </section>
  );
}

function PaginationSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/10 bg-white/6 p-5">
      <SkeletonLine className="w-44" />
      <div className="flex gap-2">
        <SkeletonBlock className="h-10 w-24 rounded-2xl" />
        <SkeletonBlock className="h-10 w-20 rounded-2xl" />
      </div>
    </div>
  );
}

function ExploreLinksSkeleton() {
  return (
    <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
      <SkeletonLine className="w-32" />
      <div className="mt-5 flex flex-wrap gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-10 w-40 rounded-full" />
        ))}
      </div>
    </section>
  );
}
