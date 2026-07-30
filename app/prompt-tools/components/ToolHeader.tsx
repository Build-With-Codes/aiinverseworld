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
    <section className="relative overflow-hidden border-b border-border-subtle py-12 sm:py-14 lg:py-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-electric/10 via-brand-violet/6 to-transparent"
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
          <div className="rounded-card border border-border-subtle bg-surface-glass p-5 shadow-card backdrop-blur lg:w-72">
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
