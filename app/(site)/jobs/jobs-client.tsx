"use client";

import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type JobSource = {
  name?: string | null;
  provider?: string | null;
  sourceUrl?: string | null;
  url?: string | null;
  applyUrl?: string | null;
};

type ProviderSource = {
  name?: string | null;
  type?: string | null;
};

type NestedJobSource = Omit<JobSource, "provider"> & {
  provider?: string | ProviderSource | null;
};

type JobSkill = string | {
  name?: string | null;
  normalizedName?: string | null;
  skill?: {
    name?: string | null;
    normalizedName?: string | null;
  } | null;
};

type Job = {
  id?: string | number | null;
  title?: string | null;
  descriptionText?: string | null;
  description?: string | null;
  company?: string | { name?: string | null } | null;
  locations?: Array<string | { city?: string | null; state?: string | null; country?: string | null; name?: string | null; isRemote?: boolean | null }> | null;
  location?: string | null;
  remote?: boolean | null;
  workplaceType?: string | null;
  sources?: NestedJobSource[] | null;
  source?: string | null;
  provider?: string | null;
  skills?: JobSkill[] | null;
  tags?: JobSkill[] | null;
  employmentType?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  postedAt?: string | null;
  createdAt?: string | null;
  url?: string | null;
  applyUrl?: string | null;
};

type JobsPayload = {
  data?: Job[];
  meta?: {
    total?: number;
    count?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    unavailable?: boolean;
    message?: string;
  };
};

const categories = [
  { label: "All", value: "all" },
  { label: "AI & ML", value: "ai-ml" },
  { label: "Software", value: "software" },
  { label: "Data", value: "data" },
  { label: "Cloud", value: "cloud" },
  { label: "Security", value: "security" },
  { label: "Product & Design", value: "product-design" },
  { label: "Business & Marketing", value: "business-marketing" },
  { label: "Other Industries", value: "other" },
];

const workArrangements = ["All", "Remote", "Hybrid", "On-site"];
const experienceLevels = ["Entry", "Mid", "Senior", "Staff", "Lead"];
const employmentTypes = ["Full-time", "Contract", "Part-time", "Internship"];
const postedWithinOptions = [
  { label: "Any time", value: "" },
  { label: "24 hours", value: "1" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Relevance", value: "relevance" },
  { label: "Salary", value: "salary" },
];
const trendingSearches = ["AI Engineer", "Remote", "Python", "Machine Learning", "Cloud", "Security"];

function getCompanyName(company: Job["company"]) {
  if (!company) return "Unknown company";
  return typeof company === "string" ? company : company.name ?? "Unknown company";
}

function getLocations(job: Job) {
  const parsed = job.locations?.map((location) => {
    if (typeof location === "string") return location;
    if (location.isRemote && !location.city && !location.country && !location.name) return "Remote";
    return [location.city, location.state, location.country, location.name].filter(Boolean).join(", ");
  }).filter(Boolean);

  if (parsed?.length) return parsed.join(" / ");
  return job.location ?? "Location flexible";
}

function getProviderName(provider?: string | ProviderSource | null) {
  if (!provider) return null;
  return typeof provider === "string" ? provider : provider.name ?? provider.type ?? null;
}

function getSource(job: Job) {
  const source = job.sources?.[0];
  return source?.name ?? getProviderName(source?.provider) ?? job.provider ?? job.source ?? "Job feed";
}

function getApplyHref(job: Job) {
  const source = job.sources?.find((item) => item.applyUrl || item.url || item.sourceUrl);
  return job.applyUrl ?? job.url ?? source?.applyUrl ?? source?.url ?? source?.sourceUrl ?? null;
}

function isRemoteJob(job: Job) {
  return Boolean(
    job.remote ||
      job.workplaceType?.toLowerCase().includes("remote") ||
      job.locations?.some((location) => typeof location !== "string" && location.isRemote),
  );
}

function getSkillName(skill: JobSkill) {
  if (typeof skill === "string") return skill;
  return skill.skill?.name ?? skill.skill?.normalizedName ?? skill.name ?? skill.normalizedName ?? null;
}

function getJobSummary(job: Job) {
  const raw = job.descriptionText ?? job.description;
  if (!raw) return null;
  const summary = raw
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return summary.length > 220 ? `${summary.slice(0, 220)}...` : summary;
}

function formatDate(value?: string | null) {
  if (!value) return "Recently posted";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently posted";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatSalary(job: Job) {
  if (!job.salaryMin && !job.salaryMax) return null;
  const currency = job.salaryCurrency ?? "USD";
  const formatter = new Intl.NumberFormat("en", {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  });

  if (job.salaryMin && job.salaryMax) {
    return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
  }

  return job.salaryMin ? `From ${formatter.format(job.salaryMin)}` : `Up to ${formatter.format(job.salaryMax ?? 0)}`;
}

function compactNumber(value: number) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 0, notation: value > 999 ? "compact" : "standard" }).format(value);
}

function fieldClassName() {
  return "platform-filter-input h-10 rounded-sm px-3 text-sm";
}

function labelClassName() {
  return "text-xs font-semibold uppercase tracking-[0.16em] text-text-muted";
}

export function JobsClient() {
  const firstLoadRef = useRef(true);
  const instantSearchRef = useRef(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<JobsPayload["meta"]>({});
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ai-ml");
  const [workArrangement, setWorkArrangement] = useState("All");
  const [experience, setExperience] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [postedWithin, setPostedWithin] = useState("");
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [searchVersion, setSearchVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: "24",
        page: String(page),
        sort,
      });

      if (query.trim()) params.set("q", query.trim());
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (workArrangement === "Remote") params.set("remote", "true");
      if (workArrangement === "Hybrid" || workArrangement === "On-site") params.set("workplaceType", workArrangement);
      if (experience) params.set("experience", experience);
      if (employmentType) params.set("employmentType", employmentType);
      if (salaryMin.trim()) params.set("salaryMin", salaryMin.trim());
      if (salaryMax.trim()) params.set("salaryMax", salaryMax.trim());
      if (postedWithin) params.set("postedWithin", postedWithin);

      try {
        const response = await fetch(`/api/jobs/search?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json()) as JobsPayload;

        if (!response.ok || payload.meta?.unavailable) {
          throw new Error(payload.meta?.message ?? "Jobs are unavailable right now.");
        }

        setJobs(payload.data ?? []);
        setMeta(payload.meta ?? {});
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setJobs([]);
        setMeta({ total: 0 });
        setError(requestError instanceof Error ? requestError.message : "Jobs are unavailable right now.");
      } finally {
        setIsLoading(false);
        firstLoadRef.current = false;
        instantSearchRef.current = false;
      }
    }, firstLoadRef.current || instantSearchRef.current ? 0 : 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [employmentType, experience, page, postedWithin, query, salaryMax, salaryMin, searchVersion, selectedCategory, sort, workArrangement]);

  const total = meta?.total ?? meta?.count ?? jobs.length;
  const currentPage = meta?.page ?? page;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const pageLimit = meta?.limit ?? 24;
  const firstVisible = total > 0 ? (currentPage - 1) * pageLimit + 1 : 0;
  const lastVisible = total > 0 ? Math.min(firstVisible + jobs.length - 1, total) : 0;
  const activeFilterCount = [
    selectedCategory !== "all",
    workArrangement !== "All",
    experience,
    employmentType,
    salaryMin.trim(),
    salaryMax.trim(),
    postedWithin,
  ].filter(Boolean).length;
  function searchNow() {
    instantSearchRef.current = true;
    setPage(1);
    setSearchVersion((value) => value + 1);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    searchNow();
  }

  function getSelectedCategoryLabel() {
    return categories.find((category) => category.value === selectedCategory)?.label ?? "All";
  }

  function selectCategory(category: string) {
    setSelectedCategory(category);
    instantSearchRef.current = true;
    setPage(1);
    setSearchVersion((value) => value + 1);
  }

  function applyTrendingSearch(chip: string) {
    setQuery(chip);
    instantSearchRef.current = true;
    setPage(1);
    setSearchVersion((value) => value + 1);
  }

  function clearFilters() {
    setQuery("");
    setSelectedCategory("ai-ml");
    setWorkArrangement("All");
    setExperience("");
    setEmploymentType("");
    setSalaryMin("");
    setSalaryMax("");
    setPostedWithin("");
    setSort("relevance");
    instantSearchRef.current = true;
    setPage(1);
    setSearchVersion((value) => value + 1);
  }

  function goToPage(nextPage: number) {
    const boundedPage = Math.min(Math.max(1, nextPage), totalPages);
    if (boundedPage === currentPage) return;
    instantSearchRef.current = true;
    setPage(boundedPage);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document.getElementById("jobs-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  const filterPanel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">Filters</p>
          <p className="mt-0.5 text-xs text-text-muted">{activeFilterCount} active signals</p>
        </div>
        <button type="button" onClick={clearFilters} className="rounded-sm px-2.5 py-1.5 text-xs font-semibold text-text-muted hover:bg-surface-2 hover:text-text-primary">
          Clear
        </button>
      </div>

      <div className="space-y-2.5">
        <p className={labelClassName()}>Work arrangement</p>
        <div className="grid gap-2">
          {workArrangements.map((arrangement) => (
            <button
              key={arrangement}
              type="button"
              onClick={() => {
                setWorkArrangement(arrangement);
                setPage(1);
              }}
              className={`rounded-sm border px-3 py-2 text-left text-sm font-semibold transition ${
                workArrangement === arrangement
                  ? "border-border-accent bg-brand-cyan/12 text-brand-cyan-strong"
                  : "border-border-subtle bg-surface-1/55 text-text-secondary hover:border-border-accent hover:text-text-primary"
              }`}
            >
              {arrangement}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className={labelClassName()}>Experience</p>
        <div className="flex flex-wrap gap-2">
          {experienceLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => {
                setExperience((current) => current === level ? "" : level);
                setPage(1);
              }}
              className={`rounded-sm border px-2.5 py-1.5 text-xs font-semibold transition ${
                experience === level
                  ? "border-border-accent bg-brand-cyan/12 text-brand-cyan-strong"
                  : "border-border-subtle bg-surface-1/55 text-text-secondary hover:border-border-accent hover:text-text-primary"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <label className={labelClassName()} htmlFor="employment-type">Employment type</label>
        <select
          id="employment-type"
          aria-label="Employment type"
          value={employmentType}
          onChange={(event) => {
            setEmploymentType(event.target.value);
            setPage(1);
          }}
          className={fieldClassName()}
        >
          <option value="">Any type</option>
          {employmentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      <div className="space-y-2.5">
        <label className={labelClassName()} htmlFor="posted-within">Posted within</label>
        <select
          id="posted-within"
          aria-label="Posted within"
          value={postedWithin}
          onChange={(event) => {
            setPostedWithin(event.target.value);
            setPage(1);
          }}
          className={fieldClassName()}
        >
          {postedWithinOptions.map((option) => <option key={option.label} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      <div className="space-y-2.5">
        <p className={labelClassName()}>Salary range</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            aria-label="Minimum salary"
            inputMode="numeric"
            value={salaryMin}
            onChange={(event) => {
              setSalaryMin(event.target.value);
              setPage(1);
            }}
            placeholder="Min"
            className={fieldClassName()}
          />
          <input
            aria-label="Maximum salary"
            inputMode="numeric"
            value={salaryMax}
            onChange={(event) => {
              setSalaryMax(event.target.value);
              setPage(1);
            }}
            placeholder="Max"
            className={fieldClassName()}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <label className={labelClassName()} htmlFor="sort-jobs">Sort</label>
        <select
          id="sort-jobs"
          aria-label="Sort jobs"
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            setPage(1);
          }}
          className={fieldClassName()}
        >
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="pb-12 pt-6 sm:pt-8">
      <section className="border-b border-border-subtle pb-6">
        <div className="relative">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <Badge variant="brand" className="tracking-[0.14em]">AI & Future Technology Jobs</Badge>
              <h1 className="mt-3 text-display-2 text-text-primary">Find AI roles with fewer filters and better signal.</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
                Search high-signal AI, software, data, cloud, security, and product roles from connected job feeds.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="platform-search-shell mt-6 rounded-card p-2">
            <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_auto_auto]">
              <input
                aria-label="Search AI jobs"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Role, skill, company, or stack"
                className="platform-shell-input h-12 min-w-0 rounded-sm px-3 text-base placeholder:text-text-muted"
              />
              <Button type="submit" className="h-12 rounded-sm px-5">Search</Button>
              <Button
                type="button"
                variant="secondary"
                className="h-12 rounded-sm px-4 lg:hidden"
                aria-expanded={showFilters}
                onClick={() => setShowFilters((value) => !value)}
              >
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </Button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Trending skills</span>
            {trendingSearches.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => applyTrendingSearch(chip)}
                className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition ${
                  query.toLowerCase() === chip.toLowerCase()
                    ? "border-border-accent bg-brand-cyan/12 text-brand-cyan-strong"
                    : "border-border-subtle bg-surface-2 text-text-muted hover:border-border-accent hover:text-text-primary"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      <nav className="mt-5 overflow-x-auto pb-1 no-scrollbar" aria-label="Job categories">
        <div className="mx-auto flex w-max min-w-full gap-2 border-b border-border-subtle pb-2 sm:justify-center">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => selectCategory(category.value)}
              className={`shrink-0 rounded-sm border px-3.5 py-2 text-sm font-semibold transition sm:px-4 ${
                selectedCategory === category.value
                  ? "border-border-accent bg-brand-cyan/12 text-brand-cyan-strong shadow-glow-cyan"
                  : "border-transparent text-text-secondary hover:border-border-subtle hover:bg-surface-3 hover:text-text-primary"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      {showFilters ? (
        <section className="mt-4 border-y border-border-subtle py-4 lg:hidden">
          {filterPanel}
        </section>
      ) : null}

      <section className="mt-6 grid gap-5 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:items-start">
        <aside className="sticky top-24 hidden border-r border-border-subtle pr-5 lg:block">
          {filterPanel}
        </aside>

        <div id="jobs-results" className="min-w-0 scroll-mt-24 space-y-3">
          <div className="flex flex-col gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">{isLoading ? "Searching jobs..." : `${jobs.length} visible roles`}</p>
              <p className="mt-0.5 text-xs text-text-muted">
                {error
                  ? "The search service did not return results."
                  : total > 0
                    ? `${firstVisible}-${lastVisible} of ${compactNumber(total)} optimized ${getSelectedCategoryLabel()} roles.`
                    : `${getSelectedCategoryLabel()} roles sorted by ${sortOptions.find((option) => option.value === sort)?.label.toLowerCase() ?? "relevance"}.`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="overflow-hidden rounded-card border border-border-subtle bg-surface-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border-b border-border-subtle p-4 last:border-b-0 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="skeleton-shimmer h-5 w-2/3 rounded-pill" />
                      <div className="skeleton-shimmer mt-3 h-4 w-1/3 rounded-pill" />
                      <div className="skeleton-shimmer mt-5 h-14 rounded-sm" />
                    </div>
                    <div className="skeleton-shimmer h-9 w-24 rounded-pill" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-card border border-rose-300/20 bg-rose-300/8 p-6 text-center sm:p-8">
              <p className="font-semibold text-rose-100">Backend unavailable</p>
              <p className="mt-2 text-sm text-rose-100/80">{error}</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="overflow-hidden border-y border-border-subtle bg-surface-2/45">
              {jobs.map((job, index) => {
                const href = getApplyHref(job);
                const salary = formatSalary(job);
                const remoteRole = isRemoteJob(job);
                const skills = (job.skills ?? job.tags ?? []).map(getSkillName).filter(Boolean).slice(0, 5);
                const summary = getJobSummary(job);

                return (
                  <article key={job.id ?? `${job.title}-${index}`} className="group border-b border-border-subtle bg-surface-2 p-4 transition last:border-b-0 hover:bg-surface-3 sm:p-5">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_15rem] xl:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-sm border border-border-subtle bg-surface-1 px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                            {getSource(job)}
                          </span>
                          <span className="text-xs font-medium text-text-muted">{formatDate(job.postedAt ?? job.createdAt)}</span>
                        </div>
                        <h2 className="mt-2 text-heading-2 text-text-primary transition group-hover:text-brand-cyan-strong">{job.title ?? "AI role"}</h2>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
                          <span className="font-semibold text-brand-cyan-strong">{getCompanyName(job.company)}</span>
                          <span>{getLocations(job)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        <Badge variant={remoteRole ? "success" : "neutral"} className="tracking-[0.1em]">{remoteRole ? "Remote" : job.workplaceType ?? "Flexible"}</Badge>
                        <span className="rounded-pill border border-border-subtle bg-surface-1 px-3 py-1 text-xs font-semibold text-text-muted">
                          {job.employmentType ?? "Employment open"}
                        </span>
                        <span className="rounded-pill border border-border-subtle bg-surface-1 px-3 py-1 text-xs font-semibold text-text-muted">
                          {salary ?? "Comp not listed"}
                        </span>
                      </div>
                    </div>

                    {summary ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">{summary}</p>
                    ) : null}

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {[selectedCategory !== "all" ? getSelectedCategoryLabel() : null, ...skills].filter(Boolean).map((skill) => (
                            <span key={skill} className="rounded-sm border border-border-subtle bg-surface-1 px-2.5 py-1 text-xs font-medium text-text-muted">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-text-muted">Skills not specified</span>
                      )}
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {href ? (
                          <Button href={href} size="sm" className="rounded-sm px-4">Apply</Button>
                        ) : (
                          <span className="text-sm text-text-muted">No external link provided</span>
                        )}
                        {href ? (
                          <Button href={href} variant="ghost" size="sm" className="rounded-sm px-3">View details</Button>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="border-y border-border-subtle py-10 text-center">
              <p className="font-semibold text-text-primary">No jobs match these filters.</p>
              <p className="mt-2 text-sm text-text-muted">Try a broader role, a lighter salary range, or another future-tech category.</p>
            </div>
          )}

          {!isLoading && !error && totalPages > 1 ? (
            <nav className="flex flex-col gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:items-center sm:justify-between" aria-label="Jobs pagination">
              <p className="text-sm text-text-muted">
                Page <span className="font-semibold text-text-primary">{currentPage}</span> of <span className="font-semibold text-text-primary">{totalPages}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-sm px-4 disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={currentPage <= 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-sm px-4 disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={currentPage >= totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </nav>
          ) : null}
        </div>
      </section>
    </div>
  );
}
