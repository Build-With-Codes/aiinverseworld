"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <path
        d={direction === "left" ? "M12.5 5 7 10l5.5 5" : "M7.5 5 13 10l-5.5 5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const EDGE = 28;

/**
 * Shared horizontal-scroll shell for every tool rail on the site. Fades the
 * rail's own content near whichever edge still has more to scroll to (via
 * mask-image, so it works over any background) and reveals prev/next arrows
 * on hover/focus once there's somewhere to go.
 */
export function RailScroller({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });

    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", updateEdges);
      ro.disconnect();
    };
  }, [updateEdges]);

  const scrollBy = useCallback(
    (direction: 1 | -1) => {
      const el = scrollerRef.current;
      if (!el) return;
      el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
      // Belt-and-suspenders: some browsers coalesce/skip `scroll` events during
      // compositor-driven smooth scrolling, so re-check once the animation
      // should have settled rather than relying on it alone.
      window.setTimeout(updateEdges, 450);
    },
    [updateEdges],
  );

  const mask = `linear-gradient(to right, ${
    canScrollLeft ? "transparent 0, black " + EDGE + "px" : "black 0"
  }, black calc(100% - ${canScrollRight ? EDGE : 0}px), ${canScrollRight ? "transparent 100%" : "black 100%"})`;

  return (
    <div className="group/rail relative">
      <div
        ref={scrollerRef}
        style={{ WebkitMaskImage: mask, maskImage: mask }}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2"
      >
        {children}
      </div>

      {canScrollLeft ? (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-surface-2 p-2 text-text-secondary opacity-0 shadow-card backdrop-blur-xl transition hover:border-border-accent hover:text-text-primary focus-visible:opacity-100 group-hover/rail:opacity-100 sm:flex"
        >
          <ArrowIcon direction="left" />
        </button>
      ) : null}
      {canScrollRight ? (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-surface-2 p-2 text-text-secondary opacity-0 shadow-card backdrop-blur-xl transition hover:border-border-accent hover:text-text-primary focus-visible:opacity-100 group-hover/rail:opacity-100 sm:flex"
        >
          <ArrowIcon direction="right" />
        </button>
      ) : null}
    </div>
  );
}
