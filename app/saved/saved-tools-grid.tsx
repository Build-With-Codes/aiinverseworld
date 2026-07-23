"use client";

import Link from "next/link";

import { useSavedTools } from "@/components/engagement/saved-tools";
import { SaveButton } from "@/components/engagement/save-button";
import { ToolCard } from "@/components/tool-card";
import { StaggerGrid, StaggerItem } from "@/components/ui/motion";
import type { AITool } from "@/lib/catalog-types";

export function SavedToolsGrid({ initialTools }: { initialTools: AITool[] }) {
  const { savedIds, ready } = useSavedTools();

  // Once the client-side saved-ids set has loaded, it's the source of truth
  // (so unsaving here removes the card immediately); until then, fall back
  // to the server-rendered list so there's no flash of empty content.
  const tools = ready ? initialTools.filter((tool) => savedIds.has(tool.id)) : initialTools;

  if (tools.length === 0) {
    return (
      <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-10 text-center">
        <p className="text-heading-2 text-text-primary">No saved tools yet</p>
        <p className="text-body mt-2 text-text-secondary">
          Tap the star on any tool to save it here for later.
        </p>
        <Link
          href="/search"
          className="mt-5 inline-flex cursor-pointer rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-5 py-2.5 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
        >
          Browse tools
        </Link>
      </div>
    );
  }

  return (
    <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <StaggerItem key={tool.slug} className="space-y-2">
          <div className="flex justify-end">
            <SaveButton toolId={tool.id} toolName={tool.name} callbackUrl="/saved" />
          </div>
          <ToolCard tool={tool} />
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}
