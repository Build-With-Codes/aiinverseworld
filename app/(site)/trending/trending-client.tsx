"use client";

import { useMemo, useState } from "react";

import { compactNumber, relativeTime } from "@/components/trending/format";
import { TrendingProjectCard } from "@/components/trending/trending-project-card";
import type { TrendingProject, TrendingProjectsResponse } from "@/lib/trending/types";

const categories = ["All", "AI Agents", "LLMs", "RAG", "Vision", "Voice", "Tools", "Data", "More"] as const;
const sortOptions = ["Trending Score", "Most Stars", "Most Forks", "Recently Updated"] as const;
const pageSize = 12;

type SortOption = (typeof sortOptions)[number];
type StatIcon = "projects" | "stars" | "forks";

function StatIcon({ icon }: { icon: StatIcon }) {
  if (icon === "stars") {
    return (
        <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
        <path d="m12 3.6 2.45 5.1 5.62.78-4.1 3.96.99 5.58L12 16.36l-4.96 2.66.99-5.58-4.1-3.96 5.62-.78L12 3.6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }

  if (icon === "forks") {
    return (
        <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
        <path d="M7 5.5v4.75A3.75 3.75 0 0 0 10.75 14h2.5A3.75 3.75 0 0 0 17 10.25V5.5M7 18.5V14m10 4.5V14M7 5.5h.01M17 5.5h.01M7 18.5h.01M17 18.5h.01" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
      <path d="M4.75 7.5 12 3.25l7.25 4.25v8.75L12 20.75l-7.25-4.5V7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.5 12h7M12 8.5v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function StatCard({ icon, value, label }: { icon: StatIcon; value: string | number; label: string }) {
  const accent =
    icon === "projects"
      ? "border-brand-violet/25 bg-brand-violet/12 text-brand-violet"
      : icon === "stars"
        ? "border-warning/25 bg-warning/12 text-warning"
        : "border-brand-cyan/25 bg-brand-cyan/12 text-brand-cyan-strong";

  return (
    <div className="min-w-0 rounded-card border border-border-subtle bg-surface-1 p-4 transition duration-[var(--motion-hover)] hover:-translate-y-0.5 hover:border-border-accent hover:bg-surface-3">
      <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-card border ${accent}`}>
        <StatIcon icon={icon} />
      </div>
      <p className="min-w-0 text-2xl font-bold leading-none text-text-primary">{value}</p>
      <p className="mt-2 min-w-0 text-xs font-semibold uppercase tracking-[0.06em] text-text-muted">{label}</p>
    </div>
  );
}

function matchesCategory(project: TrendingProject, category: string) {
  if (category === "All") return true;
  if (category === "More") {
    return project.categories.some((item) => !["AI Agents", "LLMs", "RAG", "Vision", "Voice", "Tools", "Data"].includes(item));
  }
  return project.categories.includes(category as TrendingProject["categories"][number]);
}

function sortProjects(projects: TrendingProject[], sort: SortOption) {
  return [...projects].sort((left, right) => {
    if (sort === "Most Stars") return right.stars - left.stars;
    if (sort === "Most Forks") return right.forks - left.forks;
    if (sort === "Recently Updated") {
      return new Date(right.pushedAt ?? right.lastUpdated).getTime() - new Date(left.pushedAt ?? left.lastUpdated).getTime();
    }
    return right.trendScore - left.trendScore;
  });
}

export function TrendingClient({ initialData }: { initialData: TrendingProjectsResponse }) {
  const data = initialData;
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState<SortOption>("Trending Score");
  const [page, setPage] = useState(1);
  const notice = initialData.message ?? "";

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const results = data.projects.filter((project) => {
      const categoryMatch = matchesCategory(project, activeCategory);
      if (!normalizedQuery) return categoryMatch;
      const haystack = [
        project.name,
        project.fullName,
        project.owner,
        project.description,
        project.language ?? "",
        ...project.topics,
        ...project.categories,
      ]
        .join(" ")
        .toLowerCase();
      return categoryMatch && haystack.includes(normalizedQuery);
    });

    return sortProjects(results, sort);
  }, [activeCategory, data.projects, query, sort]);

  const topProjects = filtered.slice(0, 3);
  const gridProjects = filtered.slice(3);
  const totalPages = Math.max(1, Math.ceil(gridProjects.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageProjects = gridProjects.slice((safePage - 1) * pageSize, safePage * pageSize);
  const totalStars = data.projects.reduce((sum, project) => sum + project.stars, 0);
  const totalForks = data.projects.reduce((sum, project) => sum + project.forks, 0);

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="space-y-8 pb-16 pt-8">
      <section className="relative overflow-hidden rounded-card-lg border border-border-accent bg-gradient-to-br from-brand-electric/10 via-brand-violet/10 to-transparent p-5 shadow-glow-violet sm:p-7 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_32rem] lg:items-center">
          <div>
            <p className="text-caption font-semibold tracking-[0.22em] text-brand-violet uppercase">Open-source AI radar</p>
            <h1 className="text-display-1 mt-4 max-w-4xl text-text-primary">Trending AI Projects</h1>
            <p className="text-body-lg mt-3 max-w-3xl text-text-secondary">
              Discover open-source AI projects gaining momentum right now from developers around the world.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-text-secondary">
              <span>Updated {relativeTime(data.updatedAt)}</span>
            </div>
          </div>
          <div className="rounded-card-lg border border-border-subtle bg-surface-2/90 p-4 backdrop-blur-xl">
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard icon="projects" value={data.projects.length || "Soon"} label="Projects" />
              <StatCard icon="stars" value={data.projects.length ? compactNumber(totalStars) : "Soon"} label="Stars" />
              <StatCard icon="forks" value={data.projects.length ? compactNumber(totalForks) : "Soon"} label="Forks" />
            </div>
            <p className="mt-4 rounded-card border border-border-subtle bg-surface-1 px-4 py-3 text-xs leading-5 text-text-muted">
              A focused radar for finding high-momentum AI projects before they become obvious.
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <label className="sr-only" htmlFor="project-search">Search projects</label>
          <input
            id="project-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetPage();
            }}
            placeholder="Search projects, owners, topics, languages..."
            className="min-h-12 rounded-button border border-border-subtle bg-surface-2 px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-border-accent"
          />
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as SortOption);
              resetPage();
            }}
            className="min-h-12 rounded-button border border-border-subtle bg-surface-2 px-4 text-sm font-semibold text-text-primary outline-none transition focus:border-border-accent"
            aria-label="Sort projects"
          >
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                resetPage();
              }}
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
      </div>

      {notice ? (
        <p className="rounded-card border border-border-subtle bg-surface-2 px-4 py-3 text-sm text-text-secondary">{notice}</p>
      ) : null}

      {!data.projects.length ? (
        <section className="rounded-card-lg border border-border-subtle bg-surface-2 p-8 text-center">
          <h2 className="text-heading-1 text-text-primary">Trending projects are being prepared</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            We are collecting the first project radar. Please check back shortly.
          </p>
        </section>
      ) : (
        <>
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-caption font-semibold tracking-[0.2em] text-warning uppercase">Trending now</p>
                <h2 className="text-heading-1 mt-2 text-text-primary">Top projects this cycle</h2>
              </div>
              <p className="text-sm text-text-muted">Curated by public momentum signals.</p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {topProjects.map((project) => (
                <TrendingProjectCard
                  key={project.fullName}
                  project={project}
                  featured
                  showRank={false}
                />
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-heading-1 text-text-primary">All Trending Projects</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Showing {gridProjects.length ? (safePage - 1) * pageSize + 1 : 0}-
                  {Math.min(safePage * pageSize, gridProjects.length)} of {gridProjects.length} projects
                </p>
              </div>
              <p className="text-sm text-text-muted">Sorted by {sort.toLowerCase()}</p>
            </div>
            {pageProjects.length ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {pageProjects.map((project) => (
                  <TrendingProjectCard
                    key={project.fullName}
                    project={project}
                    showRank={false}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-8 text-center text-text-secondary">
                No projects match this search.
              </div>
            )}
            {totalPages > 1 ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={safePage === 1}
                  className="h-10 rounded-button border border-border-subtle bg-surface-2 px-3 text-sm text-text-secondary disabled:opacity-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).slice(0, 9).map((_, index) => {
                  const nextPage = index + 1;
                  return (
                    <button
                      key={nextPage}
                      type="button"
                      onClick={() => setPage(nextPage)}
                      className={`h-10 min-w-10 rounded-button border px-3 text-sm font-semibold ${
                        safePage === nextPage
                          ? "border-brand-violet bg-brand-violet text-white"
                          : "border-border-subtle bg-surface-2 text-text-secondary"
                      }`}
                    >
                      {nextPage}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={safePage === totalPages}
                  className="h-10 rounded-button border border-border-subtle bg-surface-2 px-3 text-sm text-text-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ) : null}
          </section>
        </>
      )}
    </div>
  );
}
