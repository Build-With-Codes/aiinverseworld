import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AiSolveVote } from "@/components/problems/ai-solve-vote";
import { getProblemById } from "@/lib/problem-store";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

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
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${problem.title} | AiverseWorld Problems`,
      description: problem.description.slice(0, 160),
      images: [defaultOpenGraphImage.url],
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
            Community Vote
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            Vote on whether this problem looks solvable with AI. The score is
            based only on user responses for now.
          </p>

          <div className="mt-6">
            <AiSolveVote problem={problem} />
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
              Problem Context
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">
              Add another real problem to the feed
            </h2>
          </div>
          <Link
            href="/problems/submit"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Submit Another Problem
          </Link>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300">
          This board is currently community-driven. We save submitted problems
          and collect votes on whether AI can solve them.
        </p>
      </section>
    </div>
  );
}
