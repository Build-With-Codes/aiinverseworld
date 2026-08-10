import type { ReactNode } from "react";
import { FAQ } from "@/app/(site)/prompt-tools/components/FAQ";
import { RelatedTools } from "@/app/(site)/prompt-tools/components/RelatedTools";
import { ToolActions } from "@/app/(site)/prompt-tools/components/ToolActions";
import { ToolFooter } from "@/app/(site)/prompt-tools/components/ToolFooter";
import { ToolHeader } from "@/app/(site)/prompt-tools/components/ToolHeader";
import { ToolSidebar } from "@/app/(site)/prompt-tools/components/ToolSidebar";
import { StructuredDataScript } from "@/components/structured-data-script";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { buildUrl, siteName } from "@/lib/seo";
import { getRelatedPromptTools, type PromptTool, type PromptToolGroup } from "@/lib/prompt-tools";

type ToolLayoutProps = {
  tool: PromptTool;
  children?: ReactNode;
};

/** Family-specific, not the same three sentences repeated on all 9 pages. */
const howItWorksSteps: Record<PromptToolGroup, string[]> = {
  calculator: [
    "Enter your numbers — text length, token counts, model, or request volume.",
    "The result updates instantly as you type, no submit button needed.",
    "Read the breakdown, then adjust inputs to compare scenarios.",
  ],
  builder: [
    "Fill in the fields on the left — subject, role, context, or style.",
    "Watch the structured prompt build itself on the right as you go.",
    "Copy the finished prompt and paste it straight into your AI tool.",
  ],
  transformer: [
    "Paste your rough or messy prompt into the input field.",
    "The cleaned-up version appears immediately on the right.",
    "Compare the two, then copy the result once it reads the way you want.",
  ],
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
    <div className="space-y-14 pb-14">
      <StructuredDataScript id={`${tool.slug}-schema`} data={structuredData} />
      <div className="pt-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Prompt Tools", href: "/prompt-tools" },
            { label: tool.title },
          ]}
        />
      </div>
      <ToolHeader title={tool.title} description={tool.description} eyebrow={tool.eyebrow} tool={tool} compact />
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <div className="order-2 lg:order-1">
          <ToolSidebar activeSlug={tool.slug} />
        </div>
        <div className="order-1 min-w-0 space-y-14 lg:order-2">
          <ToolActions slug={tool.slug} actionLabel={tool.primaryAction} />
          {children}
          <section>
            <p className="text-eyebrow text-brand-electric-strong">How it works</p>
            <h2 className="text-display-2 mt-2 text-text-primary">A simple local workflow</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {howItWorksSteps[tool.group].map((step) => (
                <div key={step} className="border-t border-border-subtle pt-4">
                  <p className="text-sm leading-6 text-text-secondary">{step}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <p className="text-eyebrow text-brand-violet-strong">Use cases</p>
            <h2 className="text-display-2 mt-2 text-text-primary">Benefits and use cases</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {tool.examples.map((example) => (
                <div key={example} className="rounded-card border border-border-subtle bg-surface-2 p-4 text-sm font-semibold text-text-primary shadow-card">
                  {example}
                </div>
              ))}
            </div>
          </section>
          <FAQ items={tool.faqs} />
          <RelatedTools tools={relatedTools} />
          <ToolFooter />
        </div>
      </div>
    </div>
  );
}
