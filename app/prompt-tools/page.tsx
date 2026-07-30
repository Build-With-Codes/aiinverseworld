import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RecipeGrid } from "@/app/prompt-tools/components/RecipeGrid";
import { ToolFooter } from "@/app/prompt-tools/components/ToolFooter";
import { ToolHeader } from "@/app/prompt-tools/components/ToolHeader";
import { StructuredDataScript } from "@/components/structured-data-script";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";
import { FadeInSection, StaggerGrid, StaggerItem } from "@/components/ui/motion";
import { buildUrl, siteName } from "@/lib/seo";
import { modelPlaybooks, promptRecipes, promptStudioValues, promptTools } from "@/lib/prompt-tools";

export const metadata: Metadata = {
  title: "Prompt Tools | Free Browser-Only AI Prompt Engineering Tools",
  description:
    "Use free browser-only prompt tools for token counting, AI cost planning, context windows, prompt formatting, cleaning, templates, system prompts, Midjourney, and FLUX.",
  alternates: { canonical: "/prompt-tools" },
  openGraph: {
    title: "Prompt Tools by AiverseWorld",
    description: "A private browser-only prompt engineering workspace for serious AI workflows.",
    url: "/prompt-tools",
    type: "website",
  },
};

function SectionFallback() {
  return <div className="skeleton-shimmer min-h-40 rounded-card border border-border-subtle" />;
}

export default function PromptToolsPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Prompt Tools",
      description:
        "Free browser-only prompt engineering tools for counting tokens, estimating AI costs, formatting prompts, cleaning drafts, and building image prompts.",
      url: buildUrl("/prompt-tools"),
      publisher: {
        "@type": "Organization",
        name: siteName,
        url: buildUrl("/"),
      },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: promptTools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.title,
          url: buildUrl(tool.href),
          description: tool.description,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: buildUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Prompt Tools",
          item: buildUrl("/prompt-tools"),
        },
      ],
    },
  ];

  return (
    <div className="space-y-20 pb-14">
      <StructuredDataScript id="prompt-tools-schema" data={structuredData} />
      <ToolHeader
        title="Prompt Tools"
        description="A free, browser-only workspace for building, cleaning, measuring, and improving prompts for modern AI models."
        eyebrow="Enterprise prompt studio"
      />

      <Suspense fallback={<SectionFallback />}>
        <FadeInSection>
          <section aria-label="Prompt tools values" className="grid gap-6 border-b border-border-subtle pb-12 sm:grid-cols-2 lg:grid-cols-4">
            {promptStudioValues.map((item) => (
              <div
                key={item.title}
                className="transition duration-[var(--motion-hover)] hover:-translate-y-0.5"
              >
                <div className="mb-5 h-1.5 w-12 rounded-pill bg-brand-electric" />
                <h2 className="text-heading-2 text-text-primary">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{item.description}</p>
              </div>
            ))}
          </section>
        </FadeInSection>
      </Suspense>

      <section>
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-eyebrow text-brand-cyan-strong">Tool suite</p>
            <h2 className="text-display-2 mt-2 text-text-primary">Choose the exact prompt workflow you need</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-text-secondary">
            Each tool is built as its own route, with shared enterprise components and deterministic local logic.
          </p>
        </div>
        <StaggerGrid className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {promptTools.map((tool) => (
            <StaggerItem key={tool.slug}>
              <Link href={tool.href} className={`${cardClass({ hover: true, padding: "lg" })} flex h-full flex-col`}>
                <div className="flex items-start justify-between gap-4">
                  <Badge variant="neutral">{tool.category}</Badge>
                  <span className="rounded-pill border border-border-subtle px-3 py-1 text-xs font-semibold text-text-muted">
                    Local
                  </span>
                </div>
                <h3 className="text-heading-1 mt-6 text-text-primary">{tool.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-text-secondary">{tool.description}</p>
                <span className="mt-6 inline-flex text-sm font-semibold text-brand-cyan-strong">{tool.primaryAction}</span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="grid gap-10 border-y border-border-subtle py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-eyebrow text-brand-violet-strong">Model playbooks</p>
          <h2 className="text-display-2 mt-2 text-text-primary">Write once, adapt with intent</h2>
          <p className="text-body mt-4 text-text-secondary">
            Use simple model guidance for chat, reasoning, coding, long-context, and image workflows.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/prompt-tools/prompt-formatter" size="lg">
              Format a prompt
            </Button>
            <Button href="/prompt-tools/token-counter" variant="secondary" size="lg">
              Count tokens
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {modelPlaybooks.map((model) => (
            <article key={model.name} className="rounded-card border border-border-subtle bg-surface-2 p-5 shadow-card transition duration-[var(--motion-hover)] hover:-translate-y-0.5 hover:border-border-accent">
              <h3 className="text-heading-2 text-text-primary">{model.name}</h3>
              <p className="mt-2 text-sm font-semibold text-brand-cyan-strong">{model.bestFor}</p>
              <p className="mt-4 text-sm leading-6 text-text-secondary">{model.guidance}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="recipes" className="scroll-mt-28">
        <div className="mb-6 max-w-3xl">
          <p className="text-eyebrow text-brand-cyan-strong">Prompt recipes</p>
          <h2 className="text-display-2 mt-2 text-text-primary">Start from proven patterns</h2>
          <p className="text-body mt-3 text-text-secondary">
            Copy practical templates for marketing, engineering, research, operations, agents, and image generation.
          </p>
        </div>
        <RecipeGrid recipes={promptRecipes} />
      </section>

      <ToolFooter />
    </div>
  );
}
