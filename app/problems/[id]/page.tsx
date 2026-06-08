import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProblemById } from "@/lib/problem-store";
import { buildUrl } from "@/lib/seo";

type ProblemDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProblemDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const problem = await getProblemById(id);

  if (!problem) {
    return {
      title: "Problem Not Found | AiverseWorld",
    };
  }

  return {
    title: `${problem.title} | AiverseWorld Problems`,
    description: problem.description.slice(0, 160),
    alternates: {
      canonical: buildUrl(`/problems/${problem.id}`),
    },
    openGraph: {
      title: `${problem.title} | AiverseWorld Problems`,
      description: problem.description.slice(0, 160),
      url: buildUrl(`/problems/${problem.id}`),
      type: "article",
    },
  };
}

export default async function ProblemDetailsPage({
  params,
}: ProblemDetailsPageProps) {
  const { id } = await params;
  const problem = await getProblemById(id);

  if (!problem) {
    notFound();
  }

  return (
    <div className="space-y-10 pb-10 pt-10 sm:space-y-12 sm:pt-14">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-cyan-200 uppercase">
              Problem
            </span>
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100">
              Pain {problem.painScore}/10
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {problem.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-white/10 px-3 py-2">
              {problem.industry}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-2">
              {problem.frequency}
            </span>
          </div>

          <p className="mt-8 text-base leading-8 text-slate-300">
            {problem.description}
          </p>
        </div>

        <div className="rounded-[34px] border border-white/10 bg-white/6 p-8">
          <p className="text-sm font-semibold tracking-[0.24em] text-emerald-200 uppercase">
            AI Analysis
          </p>

          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-300">
            <div>
              <p className="font-semibold text-white">Who has this problem?</p>
              <p>{problem.analysis.whoHasThisProblem}</p>
            </div>
            <div>
              <p className="font-semibold text-white">How severe is it?</p>
              <p>{problem.analysis.severity}</p>
            </div>
            <div>
              <p className="font-semibold text-white">Can software solve it?</p>
              <p>{problem.analysis.softwareFit}</p>
            </div>
            <div>
              <p className="font-semibold text-white">Can AI help?</p>
              <p>{problem.analysis.aiFit}</p>
            </div>
            <div>
              <p className="font-semibold text-white">Market opportunity</p>
              <p>{problem.analysis.marketOpportunity}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 px-4 py-4">
            <p className="text-xs font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">
              Opportunity Score
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {problem.analysis.opportunityScore}/100
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
              Startup Ideas
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              3–5 ways someone could build around this
            </h2>
          </div>
          <Link
            href="/problems/submit"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Submit Another Problem
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {problem.analysis.startupIdeas.map((idea) => (
            <div
              key={idea}
              className="rounded-[24px] border border-white/10 bg-[#081222] p-5 text-sm leading-7 text-slate-200"
            >
              {idea}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
