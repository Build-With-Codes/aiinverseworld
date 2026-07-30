import type { Metadata } from "next";
import Link from "next/link";

import { BlogCard } from "@/components/blog-card";
import { SectionHeading } from "@/components/section-heading";
import { StructuredDataScript } from "@/components/structured-data-script";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FadeInSection } from "@/components/ui/motion";
import { getAllBlogPosts, getBlogCategories } from "@/lib/blog-api";
import { buildUrl } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { getRouteSeo } from "@/services/seo.service";

export const metadata: Metadata = buildMetadata(getRouteSeo("/blog"));

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

      <FadeInSection>
        <section className="grid gap-8 border-b border-border-subtle pb-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(24rem,0.55fr)] lg:items-end">
          <SectionHeading
            eyebrow="AI Learning Hub"
            title="Editorial intelligence for better AI decisions"
            description="Practical, editor-written coverage of the tools, models, and workflows shaping how teams actually use AI."
          />
          <div className="flex flex-wrap gap-2 lg:justify-end">
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
        </section>
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
        <div className="border-y border-border-subtle py-12 text-center text-sm text-text-muted">
          No articles in this topic yet.{" "}
          <Link href="/blog" className="font-semibold text-brand-cyan-strong">
            View all articles
          </Link>
        </div>
      ) : null}
    </div>
  );
}
