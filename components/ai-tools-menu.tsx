"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const searchExamples = [
  { href: "/search?q=ChatGPT", title: "Search ChatGPT", detail: "Assistant, writing, coding" },
  { href: "/search?q=Cursor", title: "Search Cursor", detail: "AI code editor" },
  { href: "/search?q=Midjourney", title: "Search Midjourney", detail: "Image generation" },
];

const categoryExamples = [
  { href: "/category/ai-assistant", title: "AI Assistants", detail: "Chat, research, productivity" },
  { href: "/category/coding-assistant", title: "Coding Tools", detail: "Editors and code agents" },
  { href: "/category/image-generation", title: "Image Tools", detail: "Art, design, visuals" },
];

const compareExamples = [
  { href: "/compare/chatgpt-vs-claude", title: "ChatGPT vs Claude", detail: "Writing and analysis" },
  { href: "/compare/chatgpt-vs-gemini", title: "ChatGPT vs Gemini", detail: "Assistant comparison" },
  { href: "/compare/midjourney-vs-adobe-firefly", title: "Midjourney vs Firefly", detail: "Image generators" },
];

const bestOfExamples = [
  { href: "/best-ai-tools", title: "Best AI Tools", detail: "Top ranked tools overall" },
  { href: "/free-ai-tools", title: "Free AI Tools", detail: "Useful tools with free plans" },
  { href: "/best/best-coding-tools", title: "Best Coding Tools", detail: "AI tools for developers" },
  { href: "/best/best-ai-marketing-tools", title: "Marketing Tools", detail: "SEO, content, campaigns" },
];

function MenuColumn({
  eyebrow,
  title,
  href,
  links,
}: {
  eyebrow: string;
  title: string;
  href: string;
  links: Array<{ href: string; title: string; detail: string }>;
}) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
      <Link
        href={href}
        className="group block rounded-2xl bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition hover:bg-cyan-50"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-lg font-bold text-slate-950 group-hover:text-cyan-800">
          {title}
        </h3>
      </Link>
      <div className="mt-3 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group block rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-cyan-300 hover:bg-cyan-50"
          >
            <p className="text-sm font-semibold text-slate-950 group-hover:text-cyan-800">
              {link.title}
            </p>
            <p className="mt-1 text-xs text-slate-500">{link.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function AiToolsMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative" onMouseEnter={() => setOpen(true)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-cyan-300/12 hover:text-white"
      >
        AI Tools
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
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
          className="fixed left-1/2 top-24 z-50 w-[min(88rem,calc(100vw-2rem))] -translate-x-1/2 rounded-[30px] border border-slate-200 bg-white p-5 text-slate-950 shadow-[0_30px_100px_rgba(2,6,23,0.35)]"
          onMouseLeave={close}
        >
          <div className="grid gap-4 lg:grid-cols-4">
            <MenuColumn
              eyebrow="Find tools"
              title="Search AI tools"
              href="/search"
              links={searchExamples}
            />
            <MenuColumn
              eyebrow="Browse"
              title="Explore categories"
              href="/category"
              links={categoryExamples}
            />
            <MenuColumn
              eyebrow="Compare"
              title="Compare tools"
              href="/compare"
              links={compareExamples}
            />
            <MenuColumn
              eyebrow="Best Of"
              title="Curated AI tool lists"
              href="/best-ai-tools"
              links={bestOfExamples}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const aiToolsMenuGroups = [
  { title: "Search", href: "/search", links: searchExamples },
  { title: "Categories", href: "/category", links: categoryExamples },
  { title: "Compare", href: "/compare", links: compareExamples },
  { title: "Best Of", href: "/best-ai-tools", links: bestOfExamples },
];
