import { voteProblemAction } from "@/app/actions/problems";
import {
  getProblemVoteSummary,
  type StoredProblem,
} from "@/lib/problem-store";

type AiSolveVoteProps = {
  problem: StoredProblem;
  compact?: boolean;
};

export function AiSolveVote({ problem, compact = false }: AiSolveVoteProps) {
  const summary = getProblemVoteSummary(problem);

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-white/10 bg-slate-950/20 p-4"
          : "rounded-[24px] border border-white/10 bg-slate-950/20 p-5"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-cyan-200 uppercase">
            Community AI Score
          </p>
          <p className={compact ? "mt-1 text-2xl font-semibold text-white" : "mt-1 text-3xl font-semibold text-white"}>
            {summary.aiScore}%
          </p>
        </div>
        <p className="text-right text-xs leading-5 text-slate-400">
          {summary.total} vote{summary.total === 1 ? "" : "s"}
          <br />
          {summary.aiSolvable} yes / {summary.notAiSolvable} no
        </p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-300"
          style={{ width: `${summary.aiScore}%` }}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <form action={voteProblemAction}>
          <input name="problemId" type="hidden" value={problem.id} />
          <input name="vote" type="hidden" value="aiSolvable" />
          <button
            className="w-full rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100 transition hover:border-emerald-300/45 hover:bg-emerald-300/15"
            type="submit"
          >
            AI can solve this
          </button>
        </form>
        <form action={voteProblemAction}>
          <input name="problemId" type="hidden" value={problem.id} />
          <input name="vote" type="hidden" value="notAiSolvable" />
          <button
            className="w-full rounded-full border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-xs font-semibold text-rose-100 transition hover:border-rose-300/45 hover:bg-rose-300/15"
            type="submit"
          >
            Not an AI fit
          </button>
        </form>
      </div>
    </div>
  );
}
