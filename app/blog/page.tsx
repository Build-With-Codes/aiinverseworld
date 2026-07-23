import type { Metadata } from "next";
import Link from "next/link";

import { BlogCard } from "@/components/blog-card";
import { SectionHeading } from "@/components/section-heading";
import { StructuredDataScript } from "@/components/structured-data-script";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cardClass } from "@/components/ui/card";
import { FadeInSection } from "@/components/ui/motion";
import { getAllBlogPosts, getBlogCategories } from "@/lib/blog-api";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Blog | Latest AI Tools, Trends & Guides 2026",
  description:
    "Explore the latest AI trends, practical guides, tool reviews, tutorials, and industry insights to help you learn and leverage artificial intelligence.",
  keywords:
    "AI blog, artificial intelligence, AI tools, AI trends, machine learning, ChatGPT, Claude, AI guides, AI tutorials",
  alternates: { canonical: buildUrl("/blog") },
  openGraph: {
    title: "AI Blog | Latest AI Tools, Trends & Guides 2026",
    description:
      "Discover the best AI tools, trends, and practical guides for 2026. Read expert insights on ChatGPT, Claude, image generation, and more.",
    type: "website",
    url: buildUrl("/blog"),
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Blog | Latest AI Tools, Trends & Guides 2026",
    description:
      "Explore the latest AI trends, practical guides, tool reviews, tutorials, and industry insights.",
    images: [defaultOpenGraphImage.url],
  },
};

type BlogPageProps = {
  searchParams?: Promise<{ topic?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [posts, categories, params] = await Promise.all([
    getAllBlogPosts(),
    getBlogCategories(),
    searchParams,
  ]);

  const selectedTopic = params?.topic || "";
  const visiblePosts = selectedTopic
    ? posts.filter((post) => post.category === selectedTopic)
    : posts;
  const featuredPost = visiblePosts[0];
  const restPosts = visiblePosts.slice(1);

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AiverseWorld Blog",
    description: "Latest AI tools, trends, guides, and practical insights",
    url: buildUrl("/blog"),
    blogPost: posts.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      author: { "@type": "Organization", name: post.author },
      url: buildUrl(`/blog/${post.slug}`),
    })),
  };

  return (
    <div className="space-y-10 pb-12 pt-6">
      <StructuredDataScript id="blog-schema" data={blogStructuredData} />

      <div className="pt-4">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      </div>

      <FadeInSection className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <SectionHeading
          eyebrow="AI Learning Hub"
          title="Guides, trends & deep dives on AI"
          description="Practical, editor-written coverage of the tools, models, and workflows shaping how people actually use AI."
        />
        <div className="flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-pill border px-4 py-1.5 text-sm font-medium transition ${
              selectedTopic
                ? "border-border-subtle bg-surface-1 text-text-secondary hover:border-border-accent"
                : "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong"
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/blog?topic=${encodeURIComponent(category.name)}`}
              className={`rounded-pill border px-4 py-1.5 text-sm font-medium transition ${
                selectedTopic === category.name
                  ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong"
                  : "border-border-subtle bg-surface-1 text-text-secondary hover:border-border-accent"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </FadeInSection>

      {featuredPost ? (
        <FadeInSection>
          <p className="text-eyebrow mb-4 text-brand-cyan-strong">Featured</p>
          <BlogCard post={featuredPost} featured />
        </FadeInSection>
      ) : null}

      {restPosts.length > 0 ? (
        <FadeInSection>
          <h2 className="text-heading-1 mb-5 text-text-primary">
            {selectedTopic ? `More in ${selectedTopic}` : "Latest articles"}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </FadeInSection>
      ) : null}

      {visiblePosts.length === 0 ? (
        <div className={`text-center text-sm text-text-muted ${cardClass({ padding: "lg" })}`}>
          No articles in this topic yet.{" "}
          <Link href="/blog" className="font-semibold text-brand-cyan-strong">
            View all articles
          </Link>
        </div>
      ) : null}
    </div>
  );
}
