import type { Metadata } from "next";

import { HandDetectGameClient } from "@/components/games/hand-detect/game-client";
import { SectionHeading } from "@/components/section-heading";
import { buildUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Motion Truck Drive | AiverseWorld",
  description:
    "Drive a motion-controlled truck game with browser-only two-hand steering. Camera frames stay on your device.",
  alternates: {
    canonical: buildUrl("/games/hand-detect"),
  },
  openGraph: {
    title: "Motion Truck Drive | AiverseWorld",
    description:
      "Steer a 3D-style truck road game with two-hand browser motion tracking.",
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
          title="Motion Truck Drive"
          description="Steer the truck with both hands while motion tracking runs locally in your browser."
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
