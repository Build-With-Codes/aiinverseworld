"use client";

import { Component, type ReactNode } from "react";

import { AD_PLACEMENTS } from "@/lib/ads/config";
import type { AdPlacementId } from "@/lib/ads/types";
import { AdNetwork } from "@/components/ads/ad-network";

/** An ad failing to render must never take the rest of the page down with it. */
class AdErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* swallow — see class doc comment */
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The one ad component pages/layouts are allowed to use. A caller names a
 * placement; which network renders, at which size, on which breakpoint,
 * lives in lib/ads/config.ts and the components behind AdNetwork.
 */
export function AdSlot({ placement, className }: { placement: AdPlacementId; className?: string }) {
  const formats = AD_PLACEMENTS[placement];
  if (!formats) return null;

  const sidebarOnly = formats.mobile === null;
  const sameFormat = formats.mobile === formats.desktop;

  return (
    <div className={`mx-auto w-full ${className ?? ""}`}>
      <p className="mb-1 text-center text-[0.625rem] font-semibold uppercase tracking-wider text-text-muted">
        Advertisement
      </p>
      <AdErrorBoundary>
        {sameFormat ? (
          <AdNetwork format={formats.desktop} />
        ) : (
          <>
            {formats.mobile ? (
              <div className="md:hidden">
                <AdNetwork format={formats.mobile} />
              </div>
            ) : null}
            <div className={sidebarOnly ? "hidden lg:block" : "hidden md:block"}>
              <AdNetwork format={formats.desktop} />
            </div>
          </>
        )}
      </AdErrorBoundary>
    </div>
  );
}
