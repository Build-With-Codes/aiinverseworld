"use client";

import { useActionState } from "react";

import { submitReview, type ReviewFormState } from "@/app/actions/reviews";

const initialState: ReviewFormState = {};

type ReviewFormProps = {
  toolSlug: string;
};

export function ReviewForm({ toolSlug }: ReviewFormProps) {
  const [state, action, pending] = useActionState(submitReview, initialState);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="toolSlug" value={toolSlug} />

      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-medium">Rating</span>
          <select
            name="rating"
            defaultValue="5"
            className="w-full rounded-2xl border border-white/10 bg-[#071120] px-4 py-3 text-sm text-slate-200 outline-none"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-300">
          <span className="font-medium">Review</span>
          <textarea
            name="comment"
            rows={5}
            placeholder="Share what worked, what did not, and how this tool fits your workflow."
            className="w-full rounded-2xl border border-white/10 bg-[#071120] px-4 py-3 text-sm text-slate-200 outline-none"
          />
        </label>
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-70"
      >
        {pending ? "Saving review..." : "Post Review"}
      </button>
    </form>
  );
}
