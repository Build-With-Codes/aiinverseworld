import { notFound } from "next/navigation";
import Link from "next/link";
import { StructuredDataScript } from "@/components/structured-data-script";
import { blogPosts, getBlogPost, getAllBlogPosts } from "@/lib/blog-data";
import { getBlogSuggestions } from "@/lib/blog-suggestions";
import { defaultOpenGraphImage } from "@/lib/seo";
import { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) {
    return {};
  }

  return {
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.description,
    keywords: `${post.category}, AI tools, artificial intelligence, ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [defaultOpenGraphImage.url],
    },
  };
}

// FAQ Schema data for specific posts
const faqSchemas: Record<string, Array<{ question: string; answer: string }>> = {
  "chatgpt-vs-claude-vs-gemini-2026": [
    {
      question: "Which AI Is Best for Writing?",
      answer: "ChatGPT and Claude are both excellent for writing. ChatGPT is better for blog posts and marketing content, while Claude excels at long-form articles and natural writing."
    },
    {
      question: "Which AI Is Best for Coding?",
      answer: "ChatGPT offers the strongest coding assistance with code generation, debugging, documentation, and learning new frameworks."
    },
    {
      question: "Which AI Is Best for Research?",
      answer: "Both Gemini and ChatGPT provide strong research capabilities. Gemini benefits from productivity workflow integration, while ChatGPT offers excellent analysis."
    },
    {
      question: "Which AI Is Best for Students?",
      answer: "ChatGPT is the best overall learning companion for students, Claude is best for essay writing, and Gemini is best for research and productivity."
    },
    {
      question: "What is the pricing?",
      answer: "Most users can start with free versions of all three platforms. Premium subscriptions typically provide faster responses, advanced models, higher usage limits, and additional features."
    }
  ],
  "50-chatgpt-prompts-save-hours": [
    {
      question: "How can I use ChatGPT prompts to save time?",
      answer: "By using structured prompts like the 50 provided in this guide, you can dramatically reduce the time spent on writing, research, planning, coding, marketing, and business tasks."
    },
    {
      question: "What are the best ChatGPT prompts for content creation?",
      answer: "The best content creation prompts include: Generate Blog Post Ideas, Create Article Outlines, Rewrite Content, Create Headlines, and Write YouTube Scripts."
    },
    {
      question: "Can I customize these prompts?",
      answer: "Yes, you should customize these prompts for your specific needs. The more effectively you communicate with AI, the more value you'll gain from it."
    },
    {
      question: "Which prompts are most effective for productivity?",
      answer: "The most effective productivity prompts are: Create a Weekly Plan, Prioritize Tasks, Meeting Summary, and Productivity Improvement."
    },
    {
      question: "How do I get the best results from ChatGPT prompts?",
      answer: "For best results: be specific in your prompts, provide context, ask for structured outputs, and iterate based on the results you receive."
    }
  ],
  "25-free-ai-tools-2026": [
    {
      question: "Are these AI tools truly free?",
      answer: "Yes, all 25 tools in this guide offer free plans. Many have premium features, but the free tiers provide impressive capabilities for beginners and professionals."
    },
    {
      question: "What are the best free AI tools for writing?",
      answer: "The best free writing tools are ChatGPT, Claude, Grammarly, and QuillBot. Each offers different strengths for different writing tasks."
    },
    {
      question: "Which free AI image generator is best?",
      answer: "Leonardo AI, Ideogram, and Canva AI are all excellent free options. Leonardo AI is best for general use, Ideogram for text in images, and Canva AI for ease of use."
    },
    {
      question: "Can I use these tools for commercial projects?",
      answer: "Most free AI tools can be used for personal projects. Check each tool's terms for commercial use, as some may require premium subscriptions."
    }
  ],
  "best-ai-tools-in-2026": [
    {
      question: "What makes an AI tool the best choice?",
      answer: "The best AI tool depends on your specific needs: writing, coding, image generation, research, or video production. Consider your goals, budget, ease of use, and scalability."
    },
    {
      question: "Is ChatGPT the best AI tool for everything?",
      answer: "While ChatGPT is versatile, different tools excel in different areas. Claude is better for writing, Midjourney for images, Cursor for coding, and Runway for video."
    },
    {
      question: "How do I choose between paid and free AI tools?",
      answer: "Start with free plans to test capabilities. Most quality AI tools offer free tiers. Upgrade to paid only when you need advanced features or higher usage limits."
    },
    {
      question: "What are the most important features to look for?",
      answer: "Look for: quality of outputs, ease of use, integration with your workflow, scalability, pricing transparency, and customer support."
    }
  ]
};

type SidebarPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
};

function SidebarPostList({
  title,
  posts,
  numbered = false,
}: {
  title: string;
  posts: SidebarPost[];
  numbered?: boolean;
}) {
  if (posts.length === 0) return null;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
      <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
        {title}
      </h2>
      <div className="mt-5 space-y-3">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-300/60 hover:bg-cyan-50"
          >
            <div className="flex gap-3">
              {numbered ? (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-xs font-bold text-cyan-700">
                  {index + 1}
                </span>
              ) : null}
              <div className="min-w-0">
                <span className="text-xs font-medium text-cyan-700">{post.category}</span>
                <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-slate-950 group-hover:text-cyan-800">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
                  {post.description}
                </p>
                <p className="mt-3 text-xs text-slate-500">{post.readTime} read</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  
  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);
  const suggestedPosts = allPosts
    .filter(p => p.slug !== post.slug)
    .slice(0, 8);
  const leftRailPosts = suggestedPosts.slice(0, 4);
  const rightRailPosts = relatedPosts.length > 0
    ? relatedPosts
    : suggestedPosts.slice(4, 8);

  const blogSuggestions = getBlogSuggestions(slug);

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://aiinverseworld.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://aiinverseworld.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://aiinverseworld.com/blog/${post.slug}`
      }
    ]
  };

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": "https://aiinverseworld.com/logo.png",
    "datePublished": post.publishedAt,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "AiverseWorld",
      "logo": {
        "@type": "ImageObject",
        "url": "https://aiinverseworld.com/logo.png"
      }
    }
  };

  // FAQ schema for posts that have FAQ content
  let faqSchema = null;
  if (faqSchemas[slug]) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqSchemas[slug].map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  }

  return (
    <>
      <StructuredDataScript id="blog-post-breadcrumb-schema" data={breadcrumbSchema} />
      <StructuredDataScript id="blog-post-article-schema" data={articleSchema} />
      {faqSchema && (
        <StructuredDataScript id="blog-post-faq-schema" data={faqSchema} />
      )}
      <div className="pb-12 pt-8">
        <section className="rounded-[34px] border border-white/10 px-5 py-8 sm:px-8 lg:px-10" style={{
          background: `radial-gradient(circle at 20% 20%, ${post.theme.gradientFrom}, transparent 28%), radial-gradient(circle at 90% 10%, ${post.theme.gradientTo}, transparent 30%), linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`
        }}>
          <Link
            href="/blog"
            className="inline-flex cursor-pointer rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
          >
            Back to blog
          </Link>
          <div className="mt-8 max-w-4xl">
            <span className="inline-flex rounded-full border px-3 py-2 text-xs font-semibold tracking-[0.22em] uppercase" style={{
              borderColor: post.theme.primaryLight.includes('300') ? '#d8b4fe' : '#93c5fd',
              backgroundColor: post.theme.primary === 'purple' ? '#f3e8ff' : post.theme.primary === 'blue' ? '#eff6ff' : post.theme.primary === 'green' ? '#f0fdf4' : post.theme.primary === 'indigo' ? '#eef2ff' : post.theme.primary === 'amber' ? '#fefce8' : post.theme.primary === 'rose' ? '#ffe4e6' : post.theme.primary === 'teal' ? '#f0fdfa' : '#fff7ed',
              color: post.theme.primary === 'purple' ? '#a855f7' : post.theme.primary === 'blue' ? '#3b82f6' : post.theme.primary === 'green' ? '#22c55e' : post.theme.primary === 'indigo' ? '#6366f1' : post.theme.primary === 'amber' ? '#d97706' : post.theme.primary === 'rose' ? '#f43f5e' : post.theme.primary === 'teal' ? '#14b8a6' : '#ea580c'
            }}>
              {post.category}
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl" style={{
              color: '#ffffff'
            }}>
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              {post.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span>{post.author}</span>
              <span aria-hidden="true">|</span>
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              <span aria-hidden="true">|</span>
              <span>{post.readTime} read</span>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,18rem)_minmax(0,52rem)_minmax(0,18rem)] xl:items-start">
          <aside className="hidden xl:sticky xl:top-28 xl:block">
            <SidebarPostList title="Latest Reads" posts={leftRailPosts} numbered />
          </aside>

          <main className="mx-auto w-full max-w-4xl">
            <article className="rounded-[30px] border border-slate-200 bg-white px-5 py-7 shadow-[0_24px_80px_rgba(15,23,42,0.14)] sm:px-8 lg:px-10">
          <div className="hidden">
            <span className="bg-cyan-300/10 text-cyan-200 px-2 py-1 rounded text-xs font-medium">
              {post.category}
            </span>
            <span>•</span>
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <span>•</span>
            <span>{post.readTime} read</span>
          </div>
          
              <div
                className="blog-article-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
        </article>

        {/* Blog Suggestions - People Also Ask */}
        {blogSuggestions.length > 0 && (
          <div className="mt-12 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.10)] sm:p-6">
            <h3 className="text-xl font-bold text-slate-950 mb-6">People Also Ask</h3>
            <div className="space-y-4">
              {blogSuggestions.map((suggestion, idx) => (
                <details key={idx} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-300/60 hover:bg-cyan-50 cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-slate-950 group-hover:text-cyan-800 transition list-none">
                    <span>{suggestion.question}</span>
                    <span className="ml-2 text-cyan-300">▸</span>
                  </summary>
                  <div className="mt-4 text-slate-700 space-y-3 ml-4">
                    <p>{suggestion.answer}</p>
                    <Link
                      href={`/blog/${suggestion.relatedSlug}`}
                      className="inline-flex text-cyan-700 hover:text-cyan-900 text-sm font-medium"
                    >
                      Read full article →
                    </Link>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts - Internal Linking */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.10)] sm:p-6">
            <h3 className="text-xl font-bold text-slate-950 mb-6">Related Articles from {post.category}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-300/60 hover:bg-cyan-50"
                >
                  <h4 className="font-semibold text-slate-950 group-hover:text-cyan-800 transition line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {relatedPost.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{relatedPost.readTime}</span>
                    <span className="text-sm text-cyan-300 group-hover:underline">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
            <section className="mt-8 grid gap-5 xl:hidden">
              <SidebarPostList title="Suggested Articles" posts={suggestedPosts.slice(0, 4)} numbered />
              <SidebarPostList title={`More in ${post.category}`} posts={rightRailPosts} />
            </section>
          </main>

          <aside className="hidden xl:sticky xl:top-28 xl:block">
            <SidebarPostList
              title={relatedPosts.length > 0 ? `More in ${post.category}` : "Suggested Guides"}
              posts={rightRailPosts}
            />
          </aside>
        </div>
      </div>
    </>
  );
}
