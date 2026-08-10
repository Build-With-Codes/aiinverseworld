import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { cardClass } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import type { BlogCardData } from "@/lib/blog-api";

// Deterministic gradient per category so cover-less posts still look intentional.
const categoryGradients = [
  "from-brand-electric/25 via-brand-violet/15 to-transparent",
  "from-brand-violet/25 via-fuchsia-500/15 to-transparent",
  "from-brand-cyan/25 via-brand-electric/15 to-transparent",
  "from-emerald-400/25 via-teal-500/15 to-transparent",
  "from-amber-400/25 via-orange-500/15 to-transparent",
  "from-rose-400/25 via-brand-violet/15 to-transparent",
];

function gradientFor(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i += 1) hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  return categoryGradients[hash % categoryGradients.length];
}

type BlogCardProps = {
  post: BlogCardData;
  featured?: boolean;
  /** Heading level for the article title. Defaults to "h3" (grid card under an h2
   * section heading). Pass "h2" for a featured card with no h2 section heading above it. */
  headingLevel?: "h2" | "h3";
};

export function BlogCard({ post, featured = false, headingLevel = "h3" }: BlogCardProps) {
  const Heading = headingLevel;
  const gradient = gradientFor(post.category);
  const coverFallback = (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <span className="text-eyebrow px-6 text-center text-brand-cyan-strong opacity-80">
        {post.category}
      </span>
    </div>
  );

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full flex-col overflow-hidden ${cardClass({ hover: true, padding: "none" })} ${
        featured ? "sm:flex-row" : ""
      }`}
    >
      {/* Cover */}
      <div
        className={`relative overflow-hidden ${
          featured ? "aspect-[16/10] sm:aspect-auto sm:w-1/2" : "aspect-[16/9]"
        }`}
      >
        {post.cover ? (
          <MediaImage
            media={post.cover}
            fill
            sizes={featured ? "(min-width:640px) 50vw, 100vw" : "(min-width:1024px) 33vw, 100vw"}
            imgClassName="transition duration-500 group-hover:scale-[1.03]"
            fallback={coverFallback}
          />
        ) : (
          coverFallback
        )}
      </div>

      {/* Body */}
      <div className={`flex flex-1 flex-col p-5 ${featured ? "sm:p-7" : ""}`}>
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="brand">{post.category}</Badge>
          <span className="text-caption text-text-muted">{post.readTime} read</span>
        </div>
        <Heading
          className={`font-semibold text-text-primary transition group-hover:text-brand-cyan-strong ${
            featured ? "text-heading-1" : "text-heading-2 line-clamp-2"
          }`}
        >
          {post.title}
        </Heading>
        <p className={`text-body mt-2 text-text-secondary ${featured ? "" : "line-clamp-2"}`}>
          {post.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-caption text-text-muted">{post.author}</span>
          <span className="text-sm font-semibold text-brand-cyan-strong group-hover:underline">
            Read
          </span>
        </div>
      </div>
    </Link>
  );
}
