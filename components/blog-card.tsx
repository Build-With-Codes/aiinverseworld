import Link from "next/link";
import { BlogPost } from "@/lib/blog-data";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article className={`group ${featured ? "md:col-span-2" : ""}`}>
      <Link href={`/blog/${post.slug}`} className="block">
        <div className={`rounded-lg border bg-card transition-all duration-200 hover:bg-muted/50 hover:border-primary/20 ${
          featured ? "p-8" : "p-6"
        }`}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
              {post.category}
            </span>
            <span>•</span>
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
          </div>
          <h2 className={`font-semibold mb-3 group-hover:text-primary transition-colors ${
            featured ? "text-2xl" : "text-xl"
          }`}>
            {post.title}
          </h2>
          <p className={`text-muted-foreground mb-4 line-clamp-3 ${
            featured ? "text-base" : "text-sm"
          }`}>
            {post.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {post.readTime} read
            </span>
            <span className="text-sm text-primary group-hover:underline">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}