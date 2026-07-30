"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { FaviconBadge } from "@/components/favicon-badge";
import { Badge } from "@/components/ui/badge";
import type { AITool, Category } from "@/lib/catalog-types";
import { promptTools } from "@/lib/prompt-tools";

type MenuTool = {
  tool: AITool;
  badge?: string;
};

export type AiToolsMenuData = {
  categories: Category[];
  featured: MenuTool[];
  trending: MenuTool[];
  fresh: MenuTool[];
};

function ToolLink({ tool, badge, onNavigate }: MenuTool & { onNavigate: () => void }) {
  return (
    <Link
      href={`/tool/${tool.slug}?id=${encodeURIComponent(tool.id)}`}
      onClick={onNavigate}
      className="group flex items-start gap-3 rounded-sm border border-transparent p-2.5 transition hover:border-border-accent hover:bg-brand-cyan/8"
    >
      <FaviconBadge
        name={tool.name}
        faviconUrl={tool.favicon}
        className="h-9 w-9 shrink-0 rounded-xl"
        imgClassName="p-1.5"
        labelClassName="text-xs"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-text-primary transition group-hover:text-brand-cyan-strong">
            {tool.name}
          </p>
          {badge ? (
            <span className="shrink-0 rounded-pill bg-brand-violet/12 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-brand-violet-strong uppercase">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="truncate text-xs text-text-muted">{tool.shortDescription}</p>
      </div>
    </Link>
  );
}

function MenuTitle({ children }: { children: string }) {
  return (
    <p className="text-eyebrow mb-2 px-2.5 text-brand-cyan-strong">{children}</p>
  );
}

function PromptToolLink({
  tool,
  onNavigate,
}: {
  tool: (typeof promptTools)[number];
  onNavigate: () => void;
}) {
  return (
    <Link
      href={tool.href}
      onClick={onNavigate}
      className="group block rounded-sm border border-transparent p-2.5 transition hover:border-border-accent hover:bg-brand-cyan/8"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-semibold text-text-primary transition group-hover:text-brand-cyan-strong">
          {tool.shortTitle}
        </p>
        <span className="shrink-0 rounded-pill bg-brand-cyan/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-brand-cyan-strong uppercase">
          {tool.category}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-muted">{tool.description}</p>
    </Link>
  );
}

export function AiToolsMenu({ data }: { data: AiToolsMenuData }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const topCategories = data.categories.slice(0, 8);

  return (
    <div ref={menuRef} className="relative" onMouseEnter={() => setOpen(true)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="inline-flex cursor-pointer items-center gap-2 rounded-pill px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-brand-cyan/10 hover:text-brand-cyan-strong"
      >
        AI Tools
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M5.5 7.5 10 12l4.5-4.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>

      {open ? (
        <div
          className="fixed left-1/2 top-24 z-50 w-[min(72rem,calc(100vw-2rem))] -translate-x-1/2 origin-top animate-[megamenu-in_180ms_ease-out] overflow-hidden rounded-card-lg border border-border-subtle bg-surface-glass shadow-card-hover backdrop-blur-xl"
          onMouseLeave={close}
        >
          <div className="grid max-h-[75vh] grid-cols-1 gap-0 overflow-y-auto lg:grid-cols-[15rem_1fr]">
            {/* Categories */}
            <div className="border-b border-border-subtle p-5 lg:border-b-0 lg:border-r">
              <MenuTitle>Browse categories</MenuTitle>
              <div className="space-y-0.5">
                {topCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    onClick={close}
                    className="flex items-center justify-between gap-2 rounded-sm px-2.5 py-2 text-sm text-text-secondary transition hover:bg-brand-cyan/8 hover:text-text-primary"
                  >
                    <span className="truncate">{category.name}</span>
                    <span className="text-caption shrink-0 text-text-muted">{category.count}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/category"
                onClick={close}
                className="mt-3 block rounded-sm px-2.5 py-2 text-sm font-semibold text-brand-cyan-strong transition hover:bg-brand-cyan/8"
              >
                All categories →
              </Link>
            </div>

            {/* Tool rails */}
            <div className="grid gap-6 p-5 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <MenuTitle>Editor&apos;s picks</MenuTitle>
                <div className="space-y-0.5">
                  {data.featured.map(({ tool, badge }) => (
                    <ToolLink key={tool.slug} tool={tool} badge={badge} onNavigate={close} />
                  ))}
                </div>
              </div>
              <div>
                <MenuTitle>Trending now</MenuTitle>
                <div className="space-y-0.5">
                  {data.trending.map(({ tool, badge }) => (
                    <ToolLink key={tool.slug} tool={tool} badge={badge} onNavigate={close} />
                  ))}
                </div>
              </div>
              <div>
                <MenuTitle>Recently added</MenuTitle>
                <div className="space-y-0.5">
                  {data.fresh.map(({ tool, badge }) => (
                    <ToolLink key={tool.slug} tool={tool} badge={badge} onNavigate={close} />
                  ))}
                </div>
              </div>
              <div>
                <MenuTitle>Prompt tools</MenuTitle>
                <div className="space-y-0.5">
                  {promptTools.slice(0, 5).map((tool) => (
                    <PromptToolLink key={tool.slug} tool={tool} onNavigate={close} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border-subtle bg-surface-1 px-5 py-4">
            <Link
              href="/search"
              onClick={close}
              className="rounded-pill border border-border-subtle px-3.5 py-1.5 text-sm text-text-secondary transition hover:border-border-accent hover:text-text-primary"
            >
              Search all tools
            </Link>
            <Link
              href="/compare"
              onClick={close}
              className="rounded-pill border border-border-subtle px-3.5 py-1.5 text-sm text-text-secondary transition hover:border-border-accent hover:text-text-primary"
            >
              Compare tools
            </Link>
            <Link
              href="/collections"
              onClick={close}
              className="rounded-pill border border-border-subtle px-3.5 py-1.5 text-sm text-text-secondary transition hover:border-border-accent hover:text-text-primary"
            >
              Curated collections
            </Link>
            <Link
              href="/prompt-tools"
              onClick={close}
              className="rounded-pill border border-border-subtle px-3.5 py-1.5 text-sm text-text-secondary transition hover:border-border-accent hover:text-text-primary"
            >
              Prompt tools
            </Link>
            <Badge variant="brand" className="ml-auto hidden sm:inline-flex">
              {data.categories.reduce((sum, c) => sum + c.count, 0)}+ tools indexed
            </Badge>
          </div>
        </div>
      ) : null}
    </div>
  );
}
