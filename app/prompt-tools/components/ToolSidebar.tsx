import Link from "next/link";
import { promptTools, type PromptToolSlug } from "@/lib/prompt-tools";

type ToolSidebarProps = {
  activeSlug?: PromptToolSlug;
};

export function ToolSidebar({ activeSlug }: ToolSidebarProps) {
  return (
    <aside className="rounded-card border border-border-subtle bg-surface-2 p-4 shadow-card lg:sticky lg:top-28">
      <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-text-muted">Prompt tools</p>
      <nav aria-label="Prompt tools" className="grid gap-1">
        {promptTools.map((tool) => {
          const active = tool.slug === activeSlug;
          return (
            <Link
              key={tool.slug}
              href={tool.href}
              className={`rounded-2xl px-3 py-3 text-sm transition ${
                active
                  ? "bg-gradient-to-r from-brand-electric/16 to-brand-violet/12 text-text-primary"
                  : "text-text-secondary hover:bg-surface-3 hover:text-text-primary"
              }`}
            >
              <span className="block font-semibold">{tool.shortTitle}</span>
              <span className="mt-0.5 block text-xs text-text-muted">{tool.category}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
