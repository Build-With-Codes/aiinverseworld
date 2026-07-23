"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Toggles a `data-scrolled` attribute on the sticky header once the page has
 * scrolled past a small threshold, so the glass bar can intensify its blur/
 * shadow/border as content passes beneath it (see `.app-glass[data-scrolled]`
 * in globals.css). rAF-throttled to avoid layout thrash.
 */
export function HeaderScrollShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      ref.current?.toggleAttribute("data-scrolled", window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
