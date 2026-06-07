import { NewsCard } from "@/components/news-card";
import { SectionHeading } from "@/components/section-heading";
import { getNewsArticles } from "@/lib/news";

export default async function NewsPage() {
  const articles = await getNewsArticles(9);

  return (
    <div className="space-y-14 pb-10 pt-10 sm:space-y-16 sm:pt-14">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-emerald-100 uppercase">
            AI News Desk
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Enterprise AI news with summaries, source links, and safer legal posture
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              We collect AI news metadata, generate concise summaries through our
              OpenRouter pipeline, and send readers back to the original publishers
              for full context.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-7">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            Legal guardrails
          </p>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <p>Summaries are generated, not copied from source articles.</p>
            <p>Every card keeps canonical source attribution and outbound links.</p>
            <p>Full article text is not displayed in the product experience.</p>
            <p>Takedown and rights contact can be configured per deployment.</p>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Latest"
          title="Fresh coverage for operators, legal teams, and AI buyers"
          description="This feed is shaped for enterprise readers: governance, infrastructure, operations, and policy signals instead of generic AI hype."
        />

        {articles.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
