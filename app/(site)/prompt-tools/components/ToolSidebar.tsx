import Link from "next/link";
import { promptTools, promptToolGroupLabels, type PromptToolGroup, type PromptToolSlug } from "@/lib/prompt-tools";

type ToolSidebarProps = {
  activeSlug?: PromptToolSlug;
};

const groupOrder: PromptToolGroup[] = ["calculator", "builder", "transformer"];

export function ToolSidebar({ activeSlug }: ToolSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-28">
      <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-text-muted">Prompt tools</p>
      <nav aria-label="Prompt tools" className="space-y-5">
        {groupOrder.map((group) => {
          const tools = promptTools.filter((tool) => tool.group === group);
          if (tools.length === 0) return null;

          return (
            <div key={group}>
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted/70">
                {promptToolGroupLabels[group]}
              </p>
              <div className="grid gap-1">
                {tools.map((tool) => {
                  const active = tool.slug === activeSlug;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.href}
                      className={`rounded-2xl px-3 py-2.5 text-sm transition ${
                        active
                          ? "bg-brand-electric/10 text-text-primary"
                          : "text-text-secondary hover:bg-surface-3 hover:text-text-primary"
                      }`}
                    >
                      <span className="block font-semibold">{tool.shortTitle}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
