import Link from "next/link";

import { buildUrl } from "@/lib/seo";

export type Crumb = {
  label: string;
  href?: string;
};

/**
 * Orientation + lateral navigation for deep pages, with BreadcrumbList
 * structured data for rich results. The last crumb is the current page.
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: buildUrl(item.href) } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-caption flex items-center gap-1.5 text-text-muted">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:text-brand-electric-strong">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-text-secondary" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast ? (
                <span aria-hidden className="text-text-muted/60">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
