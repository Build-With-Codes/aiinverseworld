import type { Metadata } from "next";

import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "About Us | AiverseWorld",
  description:
    "Learn about AiverseWorld, our mission, and how we help teams discover the right AI tools.",
};

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="Company"
      title="About AiverseWorld"
      description="AiverseWorld is built to help companies discover, compare, and adopt AI tools with more clarity and less noise."
      theme="company"
      highlights={["Mission-led discovery", "Faster evaluation", "Clearer shortlists"]}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Our mission</h2>
        <p className="text-base leading-8 text-slate-300">
          We are building a trusted discovery platform for AI software. Teams use
          AiverseWorld to evaluate products faster, reduce research overhead, and
          make better procurement decisions.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">What we provide</h2>
        <p className="text-base leading-8 text-slate-300">
          Our platform organizes AI tools across categories, pricing models, use
          cases, and product maturity. We combine search, comparison pages, ratings,
          reviews, and structured vendor information into one enterprise-friendly
          experience.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Who we serve</h2>
        <p className="text-base leading-8 text-slate-300">
          AiverseWorld is designed for operators, founders, technology leaders,
          marketers, and procurement teams who need to assess AI products with
          confidence.
        </p>
      </div>
    </ContentPage>
  );
}
