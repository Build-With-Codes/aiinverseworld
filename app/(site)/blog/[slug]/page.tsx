import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleToc } from "@/components/blog/article-toc";
import { BookRecommendations } from "@/components/book-recommendations";
import { BlockRenderer } from "@/components/blog/block-renderer";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { StructuredDataScript } from "@/components/structured-data-script";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cardClass } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { getBlogPost, getRelatedPosts } from "@/lib/blog-api";
import { getBlogSuggestions } from "@/lib/blog-suggestions";
import { injectHeadingIds, tocFromBlocks } from "@/lib/blog-toc";
import { getBookRecommendations } from "@/lib/books";
import { sanitizeAdminHtml } from "@/lib/sanitize-html";
import { buildUrl } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { getBlogPostSeo } from "@/services/seo.service";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const heroGradients = [
  "from-brand-electric/18 via-brand-violet/12 to-transparent",
  "from-brand-violet/18 via-fuchsia-500/12 to-transparent",
  "from-brand-cyan/18 via-brand-electric/12 to-transparent",
  "from-emerald-400/18 via-teal-500/12 to-transparent",
  "from-amber-400/18 via-orange-500/12 to-transparent",
  "from-rose-400/18 via-brand-violet/12 to-transparent",
];

function heroGradientFor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i += 1) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  return heroGradients[hash % heroGradients.length];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(
    date,
  );
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = await getBlogPostSeo(slug);
  if (!seo) notFound();
  return buildMetadata(seo);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const [related, books] = await Promise.all([
    getRelatedPosts(slug, 3),
    getBookRecommendations({ type: "blog", key: slug, limit: 4 }),
  ]);
  // Blocks are the source of truth; fall back to HTML for any pre-block post.
  const hasBlocks = Array.isArray(post.blocks) && post.blocks.length > 0;
  const blockData = hasBlocks ? tocFromBlocks(post.blocks!) : null;
  const htmlData = hasBlocks ? null : injectHeadingIds(post.content);
  const toc = blockData ? blockData.toc : htmlData!.toc;
  const blogSuggestions = getBlogSuggestions(slug);
  const gradient = heroGradientFor(post.category);
  const publishedLabel = formatDate(post.publishedAt);
  const coverFallback = (
    <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <div
        className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-brand-violet/20 blur-3xl"
        aria-hidden
      />
    </div>
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: buildUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: buildUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: buildUrl(`/blog/${post.slug}`) },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.coverImage || buildUrl("/logo.webp"),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "AiverseWorld",
      logo: { "@type": "ImageObject", url: buildUrl("/logo.webp") },
    },
  };

  const faqSchema =
    blogSuggestions.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: blogSuggestions.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <>
      <ReadingProgress />
      <StructuredDataScript id="blog-post-breadcrumb-schema" data={breadcrumbSchema} />
      <StructuredDataScript id="blog-post-article-schema" data={articleSchema} />
      {faqSchema ? <StructuredDataScript id="blog-post-faq-schema" data={faqSchema} /> : null}

      <div className="space-y-10 pb-16 pt-6">
        <div className="pt-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>

        {/* Cover hero */}
        <header className="space-y-6">
          <div className="max-w-3xl">
            <Badge variant="brand">{post.category}</Badge>
            <h1 className="text-display-2 mt-5 text-text-primary">{post.title}</h1>
            <p className="text-body-lg mt-4 text-text-secondary">{post.description}</p>
            <div className="text-caption mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-text-muted">
              <span className="font-medium text-text-secondary">{post.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>{publishedLabel}</time>
              <span aria-hidden>·</span>
              <span>{post.readTime} read</span>
            </div>
          </div>

          <div className="relative mx-auto aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-card-lg border border-border-subtle shadow-card sm:aspect-[16/8.5] lg:aspect-[16/7.5]">
            {post.cover ? (
              <MediaImage
                media={post.cover}
                fill
                priority
                sizes="(min-width:1280px) 1024px, (min-width:768px) 90vw, 100vw"
                fallback={coverFallback}
              />
            ) : (
              coverFallback
            )}
          </div>
        </header>

        {/* Body */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start xl:grid-cols-[15rem_minmax(0,1fr)_19rem]">
          <aside className="hidden xl:sticky xl:top-24 xl:block xl:self-start">
            <ArticleToc items={toc} />
          </aside>

          <div className="min-w-0 space-y-12">
            <article className="blog-article-content max-w-none">
              {blockData ? (
                <BlockRenderer blocks={blockData.blocks} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: sanitizeAdminHtml(htmlData!.html) }} />
              )}
            </article>

            <div className="lg:hidden">
              <BookRecommendations books={books} title="Books for deeper reading" variant="sidebar" />
            </div>

            {/* People Also Ask */}
            {blogSuggestions.length > 0 ? (
              <section className={cardClass({ padding: "lg", radius: "card-lg" })}>
                <h2 className="text-heading-1 text-text-primary">People also ask</h2>
                <div className="mt-5 space-y-3">
                  {blogSuggestions.map((suggestion) => (
                    <details
                      key={suggestion.question}
                      className="group rounded-card border border-border-subtle bg-surface-1 p-5 transition hover:border-border-accent"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-text-primary [&::-webkit-details-marker]:hidden">
                        <span>{suggestion.question}</span>
                        <span className="text-brand-cyan-strong transition group-open:rotate-45" aria-hidden>
                          +
                        </span>
                      </summary>
                      <div className="text-body mt-4 space-y-3 text-text-secondary">
                        <p>{suggestion.answer}</p>
                        <Link
                          href={`/blog/${suggestion.relatedSlug}`}
                          className="inline-flex text-sm font-semibold text-brand-cyan-strong hover:underline"
                        >
                          Read full article →
                        </Link>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Related posts */}
            {related.length > 0 ? (
              <section>
                <h2 className="text-heading-1 mb-5 text-text-primary">Keep reading</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/blog/${item.slug}`}
                      className={`group ${cardClass({ hover: true })}`}
                    >
                      <Badge variant="brand">{item.category}</Badge>
                      <h3 className="mt-3 font-semibold text-text-primary transition group-hover:text-brand-cyan-strong line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-body mt-2 text-text-secondary line-clamp-2">
                        {item.description}
                      </p>
                      <span className="text-caption mt-4 inline-block text-brand-cyan-strong">
                        {item.readTime} read
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Sticky rail */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <div className="space-y-6">
              <BookRecommendations books={books} title="Books for this article" variant="sidebar" />
              <div className={cardClass({ padding: "md" })}>
                <p className="text-eyebrow text-brand-cyan-strong">Weekly digest</p>
                <p className="text-body mt-2 text-text-secondary">
                  The best new AI tools in your inbox, once a week.
                </p>
                <div className="mt-4">
                  <NewsletterSignup />
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </>
  );
}
