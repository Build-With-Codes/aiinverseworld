"use client";

import { useFormStatus } from "react-dom";

export function SubmitProblemButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Submitting..." : "Submit Problem"}
    </button>
  );
}
