import { BlogCard } from "@/components/blog-card";
import { StructuredDataScript } from "@/components/structured-data-script";
import { getAllBlogPosts } from "@/lib/blog-data";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";
import { Metadata } from "next";
import Link from "next/link";

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
    url: "https://aiverseworld.com/blog",
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
  searchParams?: Promise<{
    topic?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = getAllBlogPosts();
  const params = await searchParams;
  const selectedTopic = params?.topic || "";
  const visiblePosts = selectedTopic
    ? posts.filter((post) => post.category === selectedTopic)
    : posts;
  const featuredPost = visiblePosts[0];
  const latestPosts = visiblePosts.slice(1);
  const topPicks = posts.slice(0, 5);
  const categories = Array.from(new Set(posts.map((post) => post.category))).slice(0, 8);

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "AI Inverse World Blog",
    description: "Latest AI tools, trends, guides, and practical insights",
    url: "https://aiverseworld.com/blog",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.seoTitle || post.title,
      description: post.description,
      datePublished: post.publishedAt,
      author: {
        "@type": "Organization",
        name: post.author,
      },
      url: `https://aiverseworld.com/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <StructuredDataScript id="blog-schema" data={blogStructuredData} />

      <div className="pb-12 pt-4">
        <section className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 shadow-[0_14px_42px_rgba(2,6,23,0.18)] sm:px-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(14rem,0.35fr)_minmax(0,1fr)] xl:items-center">
            <div className="min-w-0">
              <span className="blog-section-label text-xs font-semibold tracking-[0.22em] uppercase">
                AI Learning Hub
              </span>
              <h1 className="blog-section-title mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                AI Blog
              </h1>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  className={`blog-filter-chip rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    selectedTopic
                      ? ""
                      : "blog-filter-chip--active"
                  }`}
                >
                  All
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog?topic=${encodeURIComponent(category)}`}
                    className={`blog-filter-chip rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      selectedTopic === category
                        ? "blog-filter-chip--active"
                        : ""
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-4 grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-5">
            {featuredPost ? (
              <section>
                <BlogCard post={featuredPost} featured />
              </section>
            ) : null}

            {latestPosts.length > 0 ? (
              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="blog-section-title text-lg font-bold">
                    Latest Articles
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {latestPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
                Suggested
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">Popular guides</h2>
              <div className="mt-5 space-y-3">
                {topPicks.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-300/60 hover:bg-cyan-50"
                  >
                    <div className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950 group-hover:text-cyan-800">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-xs text-slate-400">{post.readTime} read</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
