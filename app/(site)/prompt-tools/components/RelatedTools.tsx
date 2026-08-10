import Link from "next/link";
import { cardClass } from "@/components/ui/card";
import type { PromptTool } from "@/lib/prompt-tools";

type RelatedToolsProps = {
  tools: PromptTool[];
};

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (tools.length === 0) return null;

  return (
    <section>
      <div className="mb-5">
        <p className="text-eyebrow text-brand-violet-strong">Related tools</p>
        <h2 className="text-display-2 mt-2 text-text-primary">Continue your prompt workflow</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.slug} href={tool.href} className={`${cardClass({ hover: true, padding: "md" })} block`}>
            <p className="text-caption font-semibold text-brand-cyan-strong">{tool.category}</p>
            <h3 className="text-heading-2 mt-2 text-text-primary">{tool.title}</h3>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{tool.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
