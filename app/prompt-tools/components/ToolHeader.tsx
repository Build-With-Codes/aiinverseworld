import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PromptTool } from "@/lib/prompt-tools";

type ToolHeaderProps = {
  title: string;
  description: string;
  eyebrow?: string;
  tool?: PromptTool;
  compact?: boolean;
};

export function ToolHeader({ title, description, eyebrow = "Prompt tools", tool, compact = false }: ToolHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-card-lg border border-border-subtle bg-surface-2 px-5 py-10 shadow-card sm:px-8 lg:px-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--brand-electric)_16%,transparent),transparent_34%),linear-gradient(120deg,transparent,color-mix(in_srgb,var(--brand-violet)_10%,transparent))]"
        aria-hidden
      />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-4xl">
          <div className="mb-5 flex flex-wrap gap-2">
            <Badge variant="brand">{eyebrow}</Badge>
            <Badge variant="neutral">Free</Badge>
            <Badge variant="neutral">Browser-only</Badge>
            <Badge variant="neutral">Private by design</Badge>
          </div>
          <h1 className={compact ? "text-display-2 text-balance text-text-primary" : "text-display-1 text-balance text-text-primary"}>
            {title}
          </h1>
          <p className="text-body-lg mt-5 max-w-3xl text-text-secondary">{description}</p>
        </div>
        {tool ? (
          <div className="rounded-card border border-border-subtle bg-surface-glass p-5 shadow-card lg:w-72">
            <p className="text-caption text-text-muted">Best for</p>
            <p className="mt-2 text-heading-2 text-text-primary">{tool.outcome}</p>
            <div className="mt-5">
              <Button href="#tool-workspace" size="lg" className="w-full">
                {tool.primaryAction}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
