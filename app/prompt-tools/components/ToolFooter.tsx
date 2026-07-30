import { Button } from "@/components/ui/button";

export function ToolFooter() {
  return (
    <section className="rounded-card-lg border border-border-accent bg-gradient-to-r from-brand-electric/12 via-brand-violet/10 to-transparent p-7 lg:p-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-display-2 text-text-primary">Build better prompts with less friction.</h2>
          <p className="text-body mt-3 max-w-2xl text-text-secondary">
            Use the free browser tools, then save your best ideas into the AiverseWorld prompt library workflow.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Button href="/prompt-tools" size="lg">
            Open Prompt Tools
          </Button>
          <Button href="/prompts" variant="secondary" size="lg">
            Browse Prompts
          </Button>
        </div>
      </div>
    </section>
  );
}
