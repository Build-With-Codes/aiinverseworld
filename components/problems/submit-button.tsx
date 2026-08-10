"use client";

import { useFormStatus } from "react-dom";

export function SubmitProblemButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-brand-electric px-5 py-4 text-sm font-semibold text-white transition hover:bg-brand-electric-strong disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Submitting..." : "Submit Problem"}
    </button>
  );
}
