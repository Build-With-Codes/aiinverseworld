import type { Block } from "@/lib/blog-api";

export type TocItem = { id: string; text: string };

function slugifyText(text: string, fallback: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || fallback
  );
}

/**
 * Build a table of contents from level-2 heading blocks and return a copy of
 * the blocks with stable `id`s assigned to those headings (so the renderer and
 * the scroll-spy TOC agree on anchors).
 */
export function tocFromBlocks(blocks: Block[]): { blocks: Block[]; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const out = blocks.map((block) => {
    if (block.type === "heading" && block.level === 2) {
      const text = block.html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      if (!text) return block;
      const base = slugifyText(text, `section-${toc.length + 1}`);
      let id = base;
      let i = 2;
      while (used.has(id)) id = `${base}-${i++}`;
      used.add(id);
      toc.push({ id, text });
      return { ...block, id };
    }
    return block;
  });

  return { blocks: out, toc };
}

/**
 * Extract H2 headings from raw HTML content, assign stable ids, and inject
 * those ids into the markup so the client TOC can scroll-spy them. Server-only
 * pure function.
 */
export function injectHeadingIds(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const out = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (!text) return match;

    const base =
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60) || `section-${toc.length + 1}`;
    let id = base;
    let i = 2;
    while (used.has(id)) id = `${base}-${i++}`;
    used.add(id);
    toc.push({ id, text });

    if (/\sid=/.test(attrs)) return match; // respect an existing id
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });

  return { html: out, toc };
}
