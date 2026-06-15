import Link from "next/link";
import { BlogPost } from "@/lib/blog-data";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

function getArticlePreview(post: BlogPost) {
  const plainText = post.content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&rsquo;|&lsquo;|&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return post.description;

  return `${post.description} ${plainText}`.slice(0, 520);
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const preview = featured ? getArticlePreview(post) : post.description;

  return (
    <article className={`group h-full ${featured ? "lg:col-span-2" : ""}`}>
      <Link
        href={`/blog/${post.slug}`}
        className={`grid h-full cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_26px_70px_rgba(14,116,144,0.14)] ${
          featured ? "lg:grid-cols-[18rem_minmax(0,1fr)]" : ""
        }`}
      >
        <div
          className={`relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.28),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.92),rgba(14,116,144,0.42))] ${
            featured ? "min-h-36 p-5 lg:min-h-full lg:p-6" : "p-5"
          }`}
        >
          <div className="absolute right-4 top-4">
            <span className="rounded-full border border-white/80 bg-white px-3 py-1 text-xs font-bold text-slate-950 shadow-[0_8px_22px_rgba(15,23,42,0.22)]">
              {post.readTime}
            </span>
          </div>
          <div className="flex h-full min-h-24 flex-col justify-end pr-16">
            <span className="blog-image-chip w-fit rounded-full border px-3 py-1 text-xs font-semibold">
              {post.category}
            </span>
            <h2 className={`mt-4 font-semibold leading-tight text-white ${
              featured ? "text-2xl" : "text-lg"
            }`}>
              {post.title}
            </h2>
          </div>
        </div>

        <div className={featured ? "flex flex-1 flex-col p-5 lg:p-6" : "flex flex-1 flex-col p-5"}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              <span aria-hidden="true">|</span>
              <span>{post.author}</span>
            </div>
            {featured ? (
              <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">
                Featured
              </span>
            ) : null}
          </div>
          {featured ? (
            <h3 className="mt-3 text-xl font-bold leading-tight text-slate-950 group-hover:text-cyan-800">
              Why this matters
            </h3>
          ) : null}
          <p
            className={`mt-3 leading-7 text-slate-600 ${
              featured ? "text-base" : "text-sm"
            } ${featured ? "line-clamp-10" : "line-clamp-4"}`}
          >
            {preview}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-5">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {post.category}
            </span>
            <span className="text-sm font-semibold text-cyan-700 transition group-hover:text-cyan-900">
              Read article
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
