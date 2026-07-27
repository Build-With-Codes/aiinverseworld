import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SavePromptButton } from "@/components/engagement/save-prompt-button";
import { PromptCopyButton } from "@/components/prompts/prompt-copy-button";
import { PromptShareButton } from "@/components/prompts/prompt-share-button";
import { PromptViewTracker } from "@/components/prompts/prompt-view-tracker";
import { getPromptBySlug } from "@/lib/prompts-api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PromptDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const invalidDetailValues = new Set([
  "",
  "invalid",
  "null",
  "undefined",
  "n/a",
  "none",
  "string",
  "number",
  "boolean",
  "object",
  "array",
]);

function isUsefulDetailValue(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") {
    return !invalidDetailValues.has(value.trim().toLowerCase());
  }
  return true;
}

export async function generateMetadata({ params }: PromptDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug, { revalidate: 300, timeoutMs: 5000 });
  if (!prompt) return { title: "Prompt Not Found | AiverseWorld" };

  return {
    title: `${prompt.title} Prompt | AiverseWorld`,
    description: prompt.description,
    alternates: { canonical: `/prompts/${prompt.slug}` },
  };
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug, { revalidate: 120, timeoutMs: 6000 });
  if (!prompt) notFound();

  const variables = Object.entries(prompt.variables ?? prompt.exampleInput ?? {}).filter(([, value]) => isUsefulDetailValue(value));
  const exampleOutput = isUsefulDetailValue(prompt.exampleOutput) ? prompt.exampleOutput : null;

  return (
    <div className="pt-8">
      <PromptViewTracker slug={prompt.slug} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="rounded-card-lg border border-border-subtle bg-surface-2/70 p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Badge variant="brand">{prompt.promptType}</Badge>
            <Badge variant="neutral">{prompt.difficulty}</Badge>
            <Badge variant="success">Score {prompt.qualityScore}</Badge>
          </div>
          <h1 className="mt-5 text-display-2 text-text-primary">{prompt.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-text-secondary">{prompt.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {prompt.supportedModels.map((model) => (
              <span key={model} className="rounded-pill border border-border-subtle bg-surface-1 px-3 py-1 text-xs font-semibold text-text-muted">
                {model}
              </span>
            ))}
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold text-text-primary">Prompt</h2>
            <pre className="mt-3 overflow-auto rounded-card border border-border-subtle bg-surface-1 p-5 text-sm leading-7 text-text-secondary whitespace-pre-wrap">
              {prompt.prompt}
            </pre>
          </section>

          {variables.length > 0 || exampleOutput ? (
            <section className="mt-8 grid gap-4 md:grid-cols-2">
              {variables.length > 0 ? (
                <div className="rounded-card border border-border-subtle bg-surface-1/70 p-5">
                  <h2 className="text-lg font-bold text-text-primary">Variables</h2>
                  <div className="mt-4 space-y-2">
                    {variables.map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between gap-3 rounded-sm bg-surface-2 px-3 py-2 text-sm">
                        <span className="font-semibold text-text-primary">{key}</span>
                        <span className="text-right text-text-muted">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {exampleOutput ? (
                <div className="rounded-card border border-border-subtle bg-surface-1/70 p-5">
                  <h2 className="text-lg font-bold text-text-primary">Example Output</h2>
                  <p className="mt-4 text-sm leading-6 text-text-secondary">{exampleOutput}</p>
                </div>
              ) : null}
            </section>
          ) : null}
        </article>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-card border border-border-subtle bg-surface-2/70 p-5">
            <h2 className="text-lg font-bold text-text-primary">Prompt Actions</h2>
            <div className="mt-4 grid gap-2">
              <Button href="/prompts" className="rounded-sm">Back to Library</Button>
              <PromptCopyButton slug={prompt.slug} prompt={prompt.prompt} />
              <PromptShareButton slug={prompt.slug} title={prompt.title} description={prompt.description} />
              <SavePromptButton
                promptId={prompt.id}
                promptTitle={prompt.title}
                callbackUrl={`/prompts/${prompt.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-border-subtle bg-surface-2 px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-border-accent hover:text-text-primary"
              />
            </div>
          </div>
          <div className="rounded-card border border-border-subtle bg-surface-2/70 p-5">
            <h2 className="text-lg font-bold text-text-primary">Quality</h2>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["Quality", prompt.qualityScore],
                ["Readability", prompt.readabilityScore],
                ["Structure", prompt.structureScore],
                ["Variables", prompt.variablesScore],
                ["Reusability", prompt.reusabilityScore],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-text-muted">{label}</span>
                  <span className="font-bold text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
