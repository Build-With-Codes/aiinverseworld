import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogPost, getAllBlogPosts } from "@/lib/blog-data";
import { getBlogSuggestions } from "@/lib/blog-suggestions";
import { ContentPage } from "@/components/content-page";
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
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ContentPage
        eyebrow="Blog"
        title={post.title}
        description={post.description}
        metadata={{
          category: post.category,
          publishedAt: post.publishedAt,
          readTime: post.readTime,
        }}
      >
        <article>
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-8">
            <span className="bg-cyan-300/10 text-cyan-200 px-2 py-1 rounded text-xs font-medium">
              {post.category}
            </span>
            <span>•</span>
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <span>•</span>
            <span>{post.readTime} read</span>
          </div>
          
          <div className="text-slate-200 space-y-4 [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_li]:mb-2 [&_img]:max-w-full [&_img]:h-auto blog-content">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>

        {/* Blog Suggestions - People Also Ask */}
        {blogSuggestions.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-cyan-100 mb-6">People Also Ask</h3>
            <div className="space-y-4">
              {blogSuggestions.map((suggestion, idx) => (
                <details key={idx} className="group rounded-lg border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/30 hover:bg-white/8 cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-white group-hover:text-cyan-200 transition list-none">
                    <span>{suggestion.question}</span>
                    <span className="ml-2 text-cyan-300">▸</span>
                  </summary>
                  <div className="mt-4 text-slate-300 space-y-3 ml-4">
                    <p>{suggestion.answer}</p>
                    <Link
                      href={`/blog/${suggestion.relatedSlug}`}
                      className="inline-flex text-cyan-300 hover:underline text-sm font-medium"
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
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-cyan-100 mb-6">Related Articles from {post.category}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group rounded-lg border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/30 hover:bg-white/8"
                >
                  <h4 className="font-semibold text-white group-hover:text-cyan-200 transition line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">
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
      </ContentPage>
    </>
  );
}
