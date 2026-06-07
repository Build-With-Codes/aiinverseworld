import type { NewsArticle } from "@/lib/news";
import Image from "next/image";
import Link from "next/link";

type NewsCardProps = {
  article: NewsArticle;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return "Just now";
  }

  const diffInMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));

  if (diffInMinutes < 1) {
    return "Just now";
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
}

export function NewsCard({ article }: NewsCardProps) {
  const newsPublishedTime = article.publishedAt;
  const updatedTime = article.processedAt || article.publishedAt;

  return (
    <article className="overflow-hidden rounded-[30px] border border-white/10 bg-white/6 shadow-[0_18px_60px_rgba(2,6,23,0.24)]">
      <div className="relative h-52 w-full">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <span className="rounded-full border border-white/15 bg-slate-950/55 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-100 uppercase backdrop-blur">
            {article.category}
          </span>
          <span className="rounded-full border border-white/15 bg-slate-950/55 px-3 py-1 text-xs text-slate-200 backdrop-blur">
            {formatRelativeTime(newsPublishedTime)}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan-200 uppercase">
            {article.sourceName}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            {article.title}
          </h3>
          <p className="text-sm leading-7 text-slate-300">{article.summary}</p>
        </div>

        <div className="space-y-2">
          {article.keyPoints.map((point, index) => (
            <p
              key={`${article.id}-point-${index}`}
              className="rounded-2xl border border-white/8 bg-[#081222] px-4 py-3 text-sm leading-6 text-slate-300"
            >
              {point}
            </p>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-slate-400">
          <span>{`Updated ${formatRelativeTime(updatedTime)}`}</span>
          <Link
            href={article.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-cyan-300/25 px-4 py-2 font-medium text-cyan-100 transition hover:bg-cyan-300/10"
          >
            Read original source
          </Link>
        </div>
      </div>
    </article>
  );
}
