import type { Metadata } from "next";

import { DrawGuessGameClient } from "@/components/games/draw-guess/game-client";
import { SectionHeading } from "@/components/section-heading";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Draw & Guess Game | AiverseWorld",
  description:
    "Play an AI-powered draw and guess game with progressive SVG sketches, hints, and score tracking.",
  alternates: {
    canonical: buildUrl("/games/draw-guess"),
  },
  openGraph: {
    title: "AI Draw & Guess Game | AiverseWorld",
    description:
      "Play an AI-powered draw and guess game with progressive SVG sketches, hints, and score tracking.",
    url: buildUrl("/games/draw-guess"),
    type: "website",
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Draw & Guess Game | AiverseWorld",
    description:
      "Play an AI-powered draw and guess game with progressive SVG sketches, hints, and score tracking.",
    images: [defaultOpenGraphImage.url],
  },
};

export default function DrawGuessPage() {
  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-card-lg border border-border-subtle bg-surface-2 p-8">
        <SectionHeading
          eyebrow="Game"
          title="AI Draw & Guess"
          description="Pick a category and difficulty, watch the drawing appear step by step, and guess as early as you can for the highest score."
        />
        <div className="grid gap-4 lg:grid-cols-4">
          {[
            "AI-generated SVG sketches",
            "Timed hints at 30s, 60s, and 90s",
            "Score based on speed and reveal progress",
            "Stats saved locally in your browser",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <DrawGuessGameClient />
    </div>
  );
}
