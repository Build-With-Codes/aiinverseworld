"use client";

import { useEffect, useRef } from "react";

import { recordEvent } from "@/lib/engagement-client";

/** Drop on a tool detail page to record a (deduped) view event on mount. */
export function ViewTracker({ toolId }: { toolId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current || !toolId) return;
    fired.current = true;
    recordEvent({ type: "view", toolId });
  }, [toolId]);

  return null;
}
