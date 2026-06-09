import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog-data";
import { BlogCard } from "@/components/blog-card";
import { ContentPage } from "@/components/content-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Blog | Latest AI Tools, Trends & Guides 2026",
  description: "Explore the latest AI trends, practical guides, tool reviews, tutorials, and industry insights to help you learn and leverage artificial intelligence.",
  keywords: "AI blog, artificial intelligence, AI tools, AI trends, machine learning, ChatGPT, Claude, AI guides, AI tutorials",
  openGraph: {
    title: "AI Blog | Latest AI Tools, Trends & Guides 2026",
    description: "Discover the best AI tools, trends, and practical guides for 2026. Read expert insights on ChatGPT, Claude, image generation, and more.",
    type: "website",
    url: "https://aiinverseworld.com/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Blog | Latest AI Tools, Trends & Guides 2026",
    description: "Explore the latest AI trends, practical guides, tool reviews, tutorials, and industry insights.",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "AI Inverse World Blog",
    "description": "Latest AI tools, trends, guides, and practical insights",
    "url": "https://aiinverseworld.com/blog",
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.seoTitle || post.title,
      "description": post.description,
      "datePublished": post.publishedAt,
      "author": {
        "@type": "Organization",
        "name": post.author
      },
      "url": `https://aiinverseworld.com/blog/${post.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />
      <ContentPage
        eyebrow="Learning"
        title="AI Blog"
        description="Explore the latest AI trends, practical guides, tool reviews, tutorials, and industry insights to help you learn and leverage artificial intelligence."
      >
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
            <BlogCard post={featuredPost} featured />
          </div>
        )}
        
        {otherPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {otherPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}
      </ContentPage>
    </>
  );
}
