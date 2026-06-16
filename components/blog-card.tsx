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

const getThemeRgb = (color: string) => {
  const rgbMap: Record<string, string> = {
    purple: "147, 51, 234",
    blue: "59, 130, 246",
    green: "34, 197, 94",
    indigo: "79, 70, 229",
    amber: "217, 119, 6",
    rose: "190, 24, 93",
    teal: "13, 148, 136",
    orange: "234, 88, 12",
    fuchsia: "217, 70, 239",
  };
  return rgbMap[color] || "34, 211, 238";
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const preview = featured ? getArticlePreview(post) : post.description;
  const themeRgb = getThemeRgb(post.theme?.gradientFrom || "blue");

  return (
    <article className={`group h-full ${featured ? "lg:col-span-2" : ""}`}>
      <Link
        href={`/blog/${post.slug}`}
        className={`grid h-full cursor-pointer overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(14,116,144,0.14)] ${
          featured ? "lg:grid-cols-[18rem_minmax(0,1fr)]" : ""
        }`}
        style={{
          "--hover-border-color": `rgb(${themeRgb})`,
        } as React.CSSProperties}
      >
        <div
          className={`relative overflow-hidden ${
            featured ? "min-h-36 p-5 lg:min-h-full lg:p-6" : "p-5"
          }`}
          style={{
            background: `linear-gradient(135deg, ${post.theme?.gradientFrom || '#3b82f6'}, ${post.theme?.gradientTo || '#0e7490'})`
          }}
        >
          <div className="absolute right-4 top-4">
            <span className="rounded-full border border-white/80 bg-white px-3 py-1 text-xs font-bold text-slate-950 shadow-[0_8px_22px_rgba(15,23,42,0.22)]">
              {post.readTime}
            </span>
          </div>
          <div className="flex h-full min-h-24 flex-col justify-end pr-16">
            <span
              className="w-fit rounded-full border px-3 py-1 text-xs font-semibold text-white"
              style={{
                borderColor: `rgba(255, 255, 255, 0.6)`,
                backgroundColor: `rgba(${themeRgb}, 0.2)`,
              }}
            >
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
              <span
                className="rounded-full px-3 py-1 text-xs font-bold border"
                style={{
                  backgroundColor: `rgba(${themeRgb}, 0.1)`,
                  borderColor: `rgba(${themeRgb}, 0.3)`,
                  color: `rgb(${themeRgb})`,
                }}
              >
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
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: `rgba(${themeRgb}, 0.1)`,
                color: `rgb(${themeRgb})`,
              }}
            >
              {post.category}
            </span>
            <span className="text-sm font-semibold transition" style={{ color: `rgb(${themeRgb})` }}>
              Read article
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
