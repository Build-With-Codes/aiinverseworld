import type { ReactNode } from "react";
import { FAQ } from "@/app/prompt-tools/components/FAQ";
import { RelatedTools } from "@/app/prompt-tools/components/RelatedTools";
import { ToolActions } from "@/app/prompt-tools/components/ToolActions";
import { ToolFooter } from "@/app/prompt-tools/components/ToolFooter";
import { ToolHeader } from "@/app/prompt-tools/components/ToolHeader";
import { ToolSidebar } from "@/app/prompt-tools/components/ToolSidebar";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildUrl, siteName } from "@/lib/seo";
import { getRelatedPromptTools, type PromptTool } from "@/lib/prompt-tools";

type ToolLayoutProps = {
  tool: PromptTool;
  children?: ReactNode;
};

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const relatedTools = getRelatedPromptTools(tool.slug);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.title,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web browser",
      url: buildUrl(tool.href),
      description: tool.description,
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: siteName,
        url: buildUrl("/"),
      },
      featureList: tool.examples,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
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
        {
          "@type": "ListItem",
          position: 3,
          name: tool.title,
          item: buildUrl(tool.href),
        },
      ],
    },
  ];

  return (
    <div className="space-y-10 pb-14 pt-8">
      <StructuredDataScript id={`${tool.slug}-schema`} data={structuredData} />
      <ToolHeader title={tool.title} description={tool.description} eyebrow={tool.eyebrow} tool={tool} compact />
      <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
        <ToolSidebar activeSlug={tool.slug} />
        <div className="min-w-0 space-y-10">
          <ToolActions slug={tool.slug} actionLabel={tool.primaryAction} />
          {children}
          <section className="rounded-card border border-border-subtle bg-surface-2 p-6 shadow-card">
            <p className="text-eyebrow text-brand-violet-strong">Use cases</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {tool.examples.map((example) => (
                <div key={example} className="rounded-2xl border border-border-subtle bg-surface-1 p-4 text-sm font-semibold text-text-primary">
                  {example}
                </div>
              ))}
            </div>
          </section>
          <RelatedTools tools={relatedTools} />
          <FAQ items={tool.faqs} />
          <ToolFooter />
        </div>
      </div>
    </div>
  );
}
