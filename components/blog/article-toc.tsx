"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/lib/blog-toc";

/** Sticky "On this page" list with scroll-spy highlighting of the active H2. */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="text-eyebrow mb-3 text-brand-cyan-strong">On this page</p>
      <ul className="space-y-1 border-l border-border-subtle">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`-ml-px block border-l-2 py-1.5 pl-4 transition ${
                  isActive
                    ? "border-brand-cyan-strong font-semibold text-text-primary"
                    : "border-transparent text-text-muted hover:border-border-strong hover:text-text-secondary"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
