import type { Metadata } from "next";


import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";
import { HandDetectGameClient } from "@/components/games/hand-detect/game-client";
import { SectionHeading } from "@/components/section-heading";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(getRouteSeo("/games/hand-detect"));

export default function HandDetectGamePage() {
  return (
    <div className="space-y-10 pb-10 pt-10">
      <section className="rounded-card-lg border border-border-subtle bg-surface-2 p-8">
        <SectionHeading
          level="h1"
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
              className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-slate-200"
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
