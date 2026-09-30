"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Arms (returns `armed: true`) once the element nears the viewport, via
 * IntersectionObserver — and falls back to arming after `fallbackMs`
 * regardless of intersection state.
 *
 * The fallback matters: IntersectionObserver can fail to ever fire in some
 * real-world contexts — a document whose `visibilityState` never reaches
 * `"visible"`, some in-app browsers/webviews, aggressive privacy modes. An ad
 * that silently never loads because of that is worse than one that loads a
 * few seconds later than the ideal near-viewport moment.
 */
export function useLazyArm<T extends HTMLElement>(fallbackMs = 4000) {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let settled = false;
    const arm = () => {
      if (settled) return;
      settled = true;
      io.disconnect();
      clearTimeout(timer);
      setArmed(true);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) arm();
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    const timer = setTimeout(arm, fallbackMs);
    return () => {
      settled = true;
      io.disconnect();
      clearTimeout(timer);
    };
  }, [fallbackMs]);

  return { ref, armed };
}
