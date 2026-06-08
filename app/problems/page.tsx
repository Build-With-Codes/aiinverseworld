import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/section-heading";
import { getProblems } from "@/lib/problem-store";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Startup Problems Feed | AiverseWorld",
  description:
    "Browse real startup problems submitted by operators and founders, with AI analysis and startup ideas.",
  alternates: {
    canonical: buildUrl("/problems"),
  },
  openGraph: {
    title: "Startup Problems Feed | AiverseWorld",
    description:
      "Browse real startup problems submitted by operators and founders, with AI analysis and startup ideas.",
    url: buildUrl("/problems"),
    type: "website",
  },
};

export default async function ProblemsPage() {
  const problems = await getProblems();

  return (
    <div className="space-y-14 pb-10 pt-10 sm:space-y-16 sm:pt-14">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-fuchsia-200 uppercase">
            Problem Hunt
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Real business problems with AI analysis and startup ideas
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Founders can browse recurring operational pain points, see who has
              them, and explore whether software or AI can turn them into
              venture-worthy opportunities.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-7">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            Launch version
          </p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <p>Submit a problem in under a minute.</p>
            <p>Browse a clean feed of operator pain points.</p>
            <p>Get instant AI analysis and 3–5 startup ideas.</p>
          </div>
          <Link
            href="/problems/submit"
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Submit Problem
          </Link>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Feed"
          title="Browse recurring problems worth building around"
          description="Think of this like a lightweight Product Hunt for problems: what hurts, how often it happens, and whether software can solve it."
        />

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {problems.map((problem) => (
            <article
              key={problem.id}
              className="rounded-[28px] border border-white/10 bg-white/6 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.22em] text-cyan-200 uppercase">
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

              <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-300">
                {problem.description}
              </p>

              <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-400">
                <span>{problem.frequency}</span>
                <span>Opportunity {problem.analysis.opportunityScore}/100</span>
              </div>

              <Link
                href={`/problems/${problem.id}`}
                className="mt-6 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/15"
              >
                View Details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
