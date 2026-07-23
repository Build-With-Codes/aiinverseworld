"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { DiscoveryRail } from "@/components/engagement/discovery-rail";
import type { AITool } from "@/lib/catalog-types";

type RecentlyViewedRailProps = {
  excludeId?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  limit?: number;
};

/** Client rail that shows the signed-in user's recently viewed tools. */
export function RecentlyViewedRail({
  excludeId,
  eyebrow = "Continue exploring",
  title = "Recently viewed",
  description = "Pick up where you left off.",
  limit = 12,
}: RecentlyViewedRailProps) {
  const { status } = useSession();
  const [tools, setTools] = useState<AITool[]>([]);

  useEffect(() => {
    let cancelled = false;
    if (status !== "authenticated") {
      setTools([]);
      return;
    }
    fetch(`/api/me/recently-viewed?limit=${limit}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((payload: { data?: AITool[] }) => {
        if (cancelled) return;
        const list = (payload.data ?? []).filter((t) => t.id !== excludeId);
        setTools(list);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [status, excludeId, limit]);

  if (tools.length === 0) return null;

  return (
    <DiscoveryRail eyebrow={eyebrow} title={title} description={description} tools={tools} />
  );
}
