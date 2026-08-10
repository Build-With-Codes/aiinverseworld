import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";
import Link from "next/link";

import { AiSolveVote } from "@/components/problems/ai-solve-vote";
import { SectionHeading } from "@/components/section-heading";
import { getProblems } from "@/lib/problem-store";

export const metadata: Metadata = buildMetadata(getRouteSeo("/problems"));

type ProblemsPageProps = {
  searchParams?: Promise<{
    page?: string;
    industry?: string;
    q?: string;
    sort?: string;
  }>;
};

function buildProblemsHref(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `/problems?${query}` : "/problems";
}

export default async function ProblemsPage({ searchParams }: ProblemsPageProps) {
  const params = await searchParams;
  const selectedIndustry = params?.industry ?? "";
  const searchQuery = params?.q ?? "";
  const sort =
    params?.sort === "oldest" ||
    params?.sort === "pain" ||
    params?.sort === "ai-score"
      ? params.sort
      : "newest";
  const page = Math.max(1, Number(params?.page) || 1);
  const { problems, pagination, filters } = await getProblems({
    page,
    limit: 12,
    industry: selectedIndustry,
    search: searchQuery,
    sort,
  });

  return (
    <div className="space-y-12 pb-10 pt-10">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-fuchsia-200 uppercase">
            Problem Hunt
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Real problems ranked by whether AI can solve them
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-text-secondary sm:text-xl">
              Submit recurring pain points, browse what others are facing, and
              vote on whether each problem is a strong fit for AI.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-border-subtle bg-surface-2 p-7">
          <p className="text-sm font-semibold tracking-[0.24em] text-brand-cyan-strong uppercase">
            Launch version
          </p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-text-secondary">
            <p>Submit a problem in under a minute.</p>
            <p>Browse a clean feed of operator pain points.</p>
            <p>See the community score for whether AI can solve it.</p>
          </div>
          <Link
            href="/problems/submit"
            className="mt-6 inline-flex rounded-full bg-brand-electric px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-electric-strong"
          >
            Submit Problem
          </Link>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Feed"
          title="Browse recurring problems people want solved"
          description="Think of this like a lightweight Product Hunt for problems: what hurts, how often it happens, and whether people believe AI can solve it."
        />

        <form className="platform-search-shell mb-6 grid gap-3 rounded-card p-3 lg:grid-cols-[minmax(0,1fr)_14rem_12rem_auto]">
          <input
            className="platform-shell-input min-h-11 px-3 py-2.5 text-sm placeholder:text-text-muted"
            defaultValue={searchQuery}
            name="q"
            placeholder="Search problems"
          />
          <select
            className="platform-shell-input min-h-11 px-3 py-2.5 text-sm"
            defaultValue={selectedIndustry}
            name="industry"
          >
            <option value="">All industries</option>
            {filters.industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          <select
            className="platform-shell-input min-h-11 px-3 py-2.5 text-sm"
            defaultValue={sort}
            name="sort"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="pain">Highest pain</option>
            <option value="ai-score">AI score</option>
          </select>
          <button
            className="rounded-button bg-brand-electric px-5 py-3 text-sm font-semibold text-white shadow-glow-cyan transition hover:bg-brand-electric-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan-strong"
            type="submit"
          >
            Filter
          </button>
        </form>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {problems.map((problem) => (
            <article
              key={problem.id}
              className="rounded-card border border-border-subtle bg-surface-2 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] text-brand-cyan-strong uppercase">
                    {problem.industry}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    {problem.title}
                  </h2>
                </div>
                <div className="rounded-2xl border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-sm font-semibold text-amber-100">
                  {problem.painScore}/10
                </div>
              </div>

              <p className="mt-4 line-clamp-4 text-sm leading-7 text-text-secondary">
                {problem.description}
              </p>

              <div className="mt-5">
                <AiSolveVote problem={problem} compact />
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 text-sm text-text-muted">
                <span>{problem.frequency}</span>
                <span>{problem.industry}</span>
              </div>

              <Link
                href={`/problems/${problem.id}`}
                className="mt-6 inline-flex rounded-full border border-border-accent bg-brand-cyan/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-border-accent hover:bg-brand-cyan/10"
              >
                View Details
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-sm text-text-secondary">
          <span>
            Page {pagination.page} of {pagination.totalPages} | {pagination.total} problems
          </span>
          <div className="flex gap-2">
            <Link
              aria-disabled={pagination.page <= 1}
              className={`rounded-full border border-border-subtle px-4 py-2 font-semibold ${
                pagination.page <= 1
                  ? "pointer-events-none opacity-40"
                  : "hover:border-border-accent hover:text-cyan-100"
              }`}
              href={buildProblemsHref({
                q: searchQuery,
                industry: selectedIndustry,
                sort,
                page: pagination.page - 1,
              })}
            >
              Previous
            </Link>
            <Link
              aria-disabled={pagination.page >= pagination.totalPages}
              className={`rounded-full border border-border-subtle px-4 py-2 font-semibold ${
                pagination.page >= pagination.totalPages
                  ? "pointer-events-none opacity-40"
                  : "hover:border-border-accent hover:text-cyan-100"
              }`}
              href={buildProblemsHref({
                q: searchQuery,
                industry: selectedIndustry,
                sort,
                page: pagination.page + 1,
              })}
            >
              Next
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
