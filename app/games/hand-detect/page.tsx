import type { Metadata } from "next";

import { HandDetectGameClient } from "@/components/games/hand-detect/game-client";
import { SectionHeading } from "@/components/section-heading";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Browser Hand Detection Game | AiverseWorld",
  description:
    "Play a browser-only two-hand detection game using webcam hand tracking. Camera frames stay on your device.",
  alternates: {
    canonical: buildUrl("/games/hand-detect"),
  },
  openGraph: {
    title: "Browser Hand Detection Game | AiverseWorld",
    description:
      "Detect both hands in real time using client-side browser hand tracking.",
    url: buildUrl("/games/hand-detect"),
    type: "website",
  },
};

export default function HandDetectGamePage() {
  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <SectionHeading
          eyebrow="Game"
          title="Two-Hand Browser Detection"
          description="Enable your camera, hold both hands inside the frame, and score points while detection runs locally in your browser."
        />
        <div className="grid gap-4 lg:grid-cols-4">
          {[
            "Client-side hand tracking",
            "Detects up to two hands",
            "Canvas landmark overlay",
            "No camera upload to server",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-[#081222] px-4 py-3 text-sm text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <HandDetectGameClient />
    </div>
  );
}
