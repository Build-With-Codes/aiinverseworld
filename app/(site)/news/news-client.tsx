"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { NewsArticle } from "@/lib/news";

const preferredCategories = ["All News", "AI Research", "Models & LLMs", "Open Source", "AI Tools", "Startups"];

function relativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Updated recently";

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 1) return "Updated this minute";
  if (minutes < 60) return `Updated ${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `Updated ${days} day${days === 1 ? "" : "s"} ago`;
}

function articleTime(value: string) {
  return relativeTime(value).replace(/^Updated /, "");
}

function sourceInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function categoryClass(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("research")) return "bg-brand-violet text-white";
  if (normalized.includes("model") || normalized.includes("llm")) return "bg-brand-electric text-white";
  if (normalized.includes("open")) return "bg-brand-cyan text-slate-950";
  if (normalized.includes("startup") || normalized.includes("fund")) return "bg-success text-slate-950";
  if (normalized.includes("security")) return "bg-warning text-slate-950";
  return "bg-brand-violet text-white";
}

function NewsSource({ article }: { article: NewsArticle }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-xs text-text-secondary">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-surface-3 text-[10px] font-bold text-text-primary">
        {sourceInitials(article.sourceName)}
      </span>
      <span className="truncate">{article.sourceName}</span>
    </div>
  );
}

function FeaturedNewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="group overflow-hidden rounded-card-lg border border-border-subtle bg-surface-2 shadow-[0_18px_60px_rgba(2,6,23,0.22)] transition duration-[var(--motion-hover)] hover:-translate-y-0.5 hover:border-border-accent hover:bg-surface-3">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image src={article.imageUrl} alt={article.title} fill unoptimized sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          <span className={`rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${categoryClass(article.category)}`}>
            {article.category}
          </span>
          <span className="rounded-sm bg-slate-950/70 px-2.5 py-1 text-xs text-white backdrop-blur">{articleTime(article.publishedAt)}</span>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-violet">{article.category}</p>
        <h2 className="line-clamp-3 text-xl font-bold leading-7 text-text-primary">{article.title}</h2>
        <p className="line-clamp-3 text-sm leading-6 text-text-secondary">{article.summary || article.excerpt}</p>
        <div className="flex items-center justify-between gap-4 pt-1">
          <NewsSource article={article} />
          <Link href={article.sourceUrl} target="_blank" rel="noreferrer" className="shrink-0 text-text-muted transition hover:text-brand-cyan-strong" aria-label={`Read ${article.title}`}>
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

function LatestNewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="group overflow-hidden rounded-card border border-border-subtle bg-surface-2 transition duration-[var(--motion-hover)] hover:-translate-y-0.5 hover:border-border-accent hover:bg-surface-3">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={article.imageUrl} alt={article.title} fill unoptimized sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className={`rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${categoryClass(article.category)}`}>
            {article.category}
          </span>
        </div>
        <span className="absolute bottom-3 left-3 rounded-sm bg-slate-950/70 px-2 py-1 text-xs text-white backdrop-blur">
          {articleTime(article.publishedAt)}
        </span>
      </div>
      <div className="space-y-4 p-4">
        <h3 className="line-clamp-3 text-base font-bold leading-6 text-text-primary">{article.title}</h3>
        <div className="flex items-center justify-between gap-3">
          <NewsSource article={article} />
          <Link href={article.sourceUrl} target="_blank" rel="noreferrer" className="shrink-0 text-text-muted transition hover:text-brand-cyan-strong" aria-label={`Read ${article.title}`}>
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function NewsClient({
  articles,
  updatedAt,
  message,
}: {
  articles: NewsArticle[];
  updatedAt: string;
  message?: string;
}) {
  const categories = useMemo(() => {
    const actual = Array.from(new Set(articles.map((article) => article.category).filter(Boolean)));
    const ordered = preferredCategories.filter((category) => category === "All News" || actual.includes(category));
    const remaining = actual.filter((category) => !ordered.includes(category));
    return [...ordered, ...remaining];
  }, [articles]);
  const [activeCategory, setActiveCategory] = useState("All News");

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All News") return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [activeCategory, articles]);

  const topStories = filteredArticles.slice(0, 3);
  const latestStories = filteredArticles.slice(3, 15);

  return (
    <div className="space-y-7 pb-12 pt-8">
      <section className="space-y-5 border-b border-border-subtle pb-5">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-display-1 text-text-primary">AI News</h1>
            <p className="text-body-lg mt-3 max-w-2xl text-text-secondary">
              Stay updated with the latest AI breakthroughs, research, product launches, and industry updates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            <span>{relativeTime(updatedAt)}</span>
            {articles.length ? (
              <>
                <span aria-hidden>•</span>
                <span>{articles.length} news articles</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" aria-label="Filter AI news by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-button border px-4 py-2.5 text-sm font-semibold transition ${
                activeCategory === category
                  ? "border-brand-violet bg-brand-violet text-white shadow-glow-violet"
                  : "border-border-subtle bg-surface-2 text-text-secondary hover:border-border-accent hover:text-text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {message ? <p className="rounded-card border border-border-subtle bg-surface-2 px-4 py-3 text-sm text-text-secondary">{message}</p> : null}

      {filteredArticles.length ? (
        <>
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-heading-1 text-text-primary">Top Stories</h2>
              <span className="text-sm text-text-muted">{activeCategory}</span>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {topStories.map((article) => (
                <FeaturedNewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-heading-1 text-text-primary">Latest AI News</h2>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span>Sort by:</span>
                <span className="rounded-button border border-border-subtle bg-surface-2 px-4 py-2 font-semibold text-text-primary">Most Recent</span>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {latestStories.map((article) => (
                <LatestNewsCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="rounded-card-lg border border-border-subtle bg-surface-2 p-8 text-center">
          <h2 className="text-heading-1 text-text-primary">No news found</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            Try another category or check back shortly for fresh AI news.
          </p>
        </section>
      )}
    </div>
  );
}
