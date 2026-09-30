"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  parseConsent,
  subscribeToConsent,
} from "@/components/cookie-consent";
import { useLazyArm } from "@/components/ads/use-lazy-arm";

/**
 * Lazily embeds a static ad-creative page (public/creative/*.html) in a
 * sandboxed iframe. `sandbox` includes `allow-same-origin` — the ad
 * network's own script needs normal access to its cookies/storage to decide
 * whether to fill the impression at all; without it, the network sees an
 * opaque/null origin (a common bot signal) and reliably no-fills, which is
 * what happened when this omitted it. It still omits any
 * `allow-top-navigation*`, so the framed page can never redirect the tab —
 * that's the actual protection this sandboxing is for, not cookie isolation.
 *
 * Gated on marketing consent (same signal ConsentedScript uses for
 * AdSense/analytics) — the iframe's `src` is only set once consent is given,
 * so the ad network's script never loads at all for a visitor who declined.
 */
export function AdFrame({
  src,
  width,
  height,
  className,
}: {
  src: string;
  width: number | string;
  height: number;
  className?: string;
}) {
  const { ref, armed } = useLazyArm<HTMLDivElement>();
  const consentSnapshot = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);
  const consent = useMemo(() => parseConsent(consentSnapshot), [consentSnapshot]);

  const canLoad = armed && consent?.marketing;

  return (
    <div ref={ref} className={className} style={{ width, height, margin: "0 auto", overflow: "hidden" }}>
      {canLoad ? (
        <iframe
          title="Advertisement"
          src={src}
          width={width}
          height={height}
          scrolling="no"
          sandbox="allow-scripts allow-same-origin allow-popups"
          style={{ border: 0, display: "block", width, height }}
        />
      ) : null}
    </div>
  );
}
