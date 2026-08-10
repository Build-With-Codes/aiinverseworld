import type { Metadata } from "next";


import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";
import { submitProblemAction } from "@/app/actions/problems";
import { SubmitProblemButton } from "@/components/problems/submit-button";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = buildMetadata(getRouteSeo("/problems/submit"));

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
      <section className="rounded-card-lg border border-border-subtle bg-surface-2 p-8">
        <SectionHeading
          level="h1"
          eyebrow="Submit Problem"
          title="Share a painful business problem"
          description="Tell us what keeps slowing your team down. We will save the problem and publish it to the feed so people can vote on whether AI can solve it."
        />

        <form action={submitProblemAction} className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label htmlFor="problem-title" className="mb-2 block text-sm font-medium text-text-primary">
              Problem Title
            </label>
            <input
              id="problem-title"
              required
              name="title"
              placeholder="Scheduling staff shifts is a nightmare"
              className="platform-input px-4 py-4 text-sm"
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="problem-description" className="mb-2 block text-sm font-medium text-text-primary">
              Describe the problem
            </label>
            <textarea
              id="problem-description"
              required
              name="description"
              rows={6}
              placeholder="We manage 50 employees and spend hours every week creating schedules."
              className="platform-textarea px-4 py-4 text-sm"
            />
          </div>

          <div>
            <label htmlFor="problem-industry" className="mb-2 block text-sm font-medium text-text-primary">
              Industry
            </label>
            <input
              id="problem-industry"
              required
              name="industry"
              placeholder="Retail"
              className="platform-input px-4 py-4 text-sm"
            />
          </div>

          <div>
            <label htmlFor="problem-frequency" className="mb-2 block text-sm font-medium text-text-primary">
              How often does this happen?
            </label>
            <select
              id="problem-frequency"
              required
              name="frequency"
              defaultValue=""
              className="platform-select px-4 py-4 text-sm"
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
            <label htmlFor="problem-pain-score" className="mb-2 block text-sm font-medium text-text-primary">
              How painful is it? (1–10)
            </label>
            <input
              id="problem-pain-score"
              required
              min={1}
              max={10}
              type="number"
              name="painScore"
              placeholder="9"
              className="platform-input px-4 py-4 text-sm"
            />
          </div>

          <div>
            <label htmlFor="problem-email" className="mb-2 block text-sm font-medium text-text-primary">
              Email (optional)
            </label>
            <input
              id="problem-email"
              type="email"
              name="email"
              placeholder="you@company.com"
              className="platform-input px-4 py-4 text-sm"
            />
          </div>

          <div className="lg:col-span-2 rounded-card border border-border-subtle bg-surface-1 p-5">
            <p className="text-sm leading-7 text-text-secondary">
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
