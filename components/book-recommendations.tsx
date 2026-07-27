import Image from "next/image";
import Link from "next/link";

import type { RecommendedBook } from "@/lib/books";

type BookRecommendationsProps = {
  books: RecommendedBook[];
  title?: string;
  description?: string;
  variant?: "grid" | "sidebar";
};

function upgradeGoogleCoverUrl(value?: string | null) {
  if (!value) return null;
  return value.replace(/^http:/, "https:").replace(/([?&]zoom=)(\d+)/, "$10");
}

export function BookRecommendations({
  books,
  title = "Recommended books",
  description = "A few deeper reads matched to this page.",
  variant = "grid",
}: BookRecommendationsProps) {
  if (books.length === 0) {
    return null;
  }

  if (variant === "sidebar") {
    return (
      <aside className="rounded-card-lg border border-brand-violet/20 bg-gradient-to-br from-brand-violet/10 via-surface-1 to-brand-cyan/10 p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-eyebrow text-brand-violet-strong">Featured books</p>
            <h3 className="mt-1 text-base font-semibold text-text-primary">{title}</h3>
          </div>
          <span className="rounded-full border border-brand-violet/30 bg-brand-violet/10 px-2 py-0.5 text-[11px] font-semibold text-brand-violet-strong">
            {books.length}
          </span>
        </div>
        <div className="space-y-3">
          {books.map((book) => {
            const coverUrl = upgradeGoogleCoverUrl(book.coverUrl);
            const year = book.publishedDate?.slice(0, 4);

            return (
              <Link
                key={book.id}
                href={book.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[4.25rem_minmax(0,1fr)] gap-3 rounded-md p-1.5 transition hover:bg-surface-2"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-sm border border-border-subtle bg-surface-3 shadow-soft">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={`${book.title} book cover`}
                      fill
                      sizes="80px"
                      className="object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-cyan/15 via-surface-2 to-brand-violet/20 px-2 text-center">
                      <span className="line-clamp-4 text-[10px] font-semibold text-text-secondary">{book.title}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 py-0.5">
                  <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary group-hover:text-brand-violet-strong">
                    {book.title}
                  </h4>
                  <p className="mt-1 line-clamp-1 text-xs text-text-muted">{book.author}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-text-secondary">
                    <span className="rounded-full bg-brand-violet/10 px-2 py-0.5 font-medium text-brand-violet-strong">
                      {year ?? book.merchant}
                    </span>
                    {book.averageRating ? <span>{book.averageRating.toFixed(1)} rating</span> : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <section className="rounded-card-lg border border-border-subtle bg-surface-1/80 p-4 shadow-card backdrop-blur sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-eyebrow text-brand-violet-strong">Featured books</p>
          <h2 className="text-heading-1 mt-1 text-text-primary">{title}</h2>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>
        <span className="w-fit rounded-full border border-brand-violet/30 bg-brand-violet/10 px-3 py-1 text-xs font-semibold text-brand-violet-strong">
          {books.length} curated picks
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {books.map((book) => {
          const coverUrl = upgradeGoogleCoverUrl(book.coverUrl);
          const year = book.publishedDate?.slice(0, 4);

          return (
            <article
              key={book.id}
              className="group rounded-card border border-border-subtle bg-surface-2/70 p-2.5 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-brand-violet/45 hover:shadow-card"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-border-subtle bg-surface-3">
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={`${book.title} book cover`}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 42vw, 90vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-cyan/15 via-surface-2 to-brand-violet/20 px-4 text-center">
                    <span className="line-clamp-4 text-base font-semibold text-text-secondary">{book.title}</span>
                  </div>
                )}
                <div className="absolute right-2 top-2 rounded-md border border-white/30 bg-black/35 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                  {year ?? book.merchant}
                </div>
              </div>

              <div className="pt-3">
                <h3 className="line-clamp-2 min-h-[2.35rem] text-sm font-semibold leading-snug text-text-primary transition group-hover:text-brand-violet-strong">
                  {book.title}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-text-muted">{book.author}</p>

                <div className="mt-2 flex min-h-5 items-center justify-between gap-2 text-xs text-text-secondary">
                  <span className="line-clamp-1 rounded-full bg-brand-violet/10 px-2 py-0.5 font-medium text-brand-violet-strong">
                    {book.merchant}
                  </span>
                  {book.averageRating || book.ratingsCount ? (
                    <span className="shrink-0 font-semibold text-text-primary">
                      {book.averageRating ? book.averageRating.toFixed(1) : "Rated"}
                      {book.ratingsCount ? ` (${book.ratingsCount.toLocaleString()})` : ""}
                    </span>
                  ) : null}
                </div>

                <div className="mt-3">
                  <Link
                    href={book.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-md border border-brand-violet/55 px-3 py-2 text-sm font-semibold text-brand-violet-strong transition hover:bg-brand-violet/10"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
