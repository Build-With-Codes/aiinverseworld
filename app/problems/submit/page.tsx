import type { Metadata } from "next";

import { submitProblemAction } from "@/app/actions/problems";
import { SubmitProblemButton } from "@/components/problems/submit-button";
import { SectionHeading } from "@/components/section-heading";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Submit Problem | AiverseWorld",
  description:
    "Submit a real problem for the community to vote on whether AI can solve it.",
  alternates: {
    canonical: buildUrl("/problems/submit"),
  },
  openGraph: {
    title: "Submit Problem | AiverseWorld",
    description:
      "Submit a real problem for the community to vote on whether AI can solve it.",
    url: buildUrl("/problems/submit"),
    type: "website",
  },
};

const frequencyOptions = [
  "Several times a day",
  "Every day",
  "Every week",
  "Every month",
  "A few times a year",
];

export default function SubmitProblemPage() {
  return (
    <div className="space-y-12 pb-10 pt-10 sm:pt-14">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Submit Problem"
          title="Share a painful business problem"
          description="Tell us what keeps slowing your team down. We will save the problem and publish it to the feed so people can vote on whether AI can solve it."
        />

        <form action={submitProblemAction} className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-white">
              Problem Title
            </label>
            <input
              required
              name="title"
              placeholder="Scheduling staff shifts is a nightmare"
              className="w-full rounded-2xl border border-white/10 bg-[#081222] px-4 py-4 text-sm text-white outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-white">
              Describe the problem
            </label>
            <textarea
              required
              name="description"
              rows={6}
              placeholder="We manage 50 employees and spend hours every week creating schedules."
              className="w-full rounded-2xl border border-white/10 bg-[#081222] px-4 py-4 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Industry
            </label>
            <input
              required
              name="industry"
              placeholder="Retail"
              className="w-full rounded-2xl border border-white/10 bg-[#081222] px-4 py-4 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              How often does this happen?
            </label>
            <select
              required
              name="frequency"
              defaultValue=""
              className="w-full rounded-2xl border border-white/10 bg-[#081222] px-4 py-4 text-sm text-white outline-none"
            >
              <option value="" disabled>
                Select frequency
              </option>
              {frequencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              How painful is it? (1–10)
            </label>
            <input
              required
              min={1}
              max={10}
              type="number"
              name="painScore"
              placeholder="9"
              className="w-full rounded-2xl border border-white/10 bg-[#081222] px-4 py-4 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Email (optional)
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              className="w-full rounded-2xl border border-white/10 bg-[#081222] px-4 py-4 text-sm text-white outline-none"
            />
          </div>

          <div className="lg:col-span-2 rounded-[28px] border border-white/10 bg-[#071120] p-5">
            <p className="text-sm leading-7 text-slate-300">
              Keep the problem specific and grounded in real recurring pain.
              After submission, other users can vote on whether AI can solve it.
            </p>
          </div>

          <div className="lg:col-span-2">
            <SubmitProblemButton />
          </div>
        </form>
      </section>
    </div>
  );
}
