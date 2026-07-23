import { MediaImage } from "@/components/ui/media-image";
import type { Block } from "@/lib/blog-api";

/**
 * Renders block-based article content (the source of truth) into semantic,
 * design-system-styled markup. Text-bearing blocks carry trusted inline HTML
 * (bold/links/code) authored in the CMS; structural blocks (table, image,
 * divider) are fully typed. Wrap the output in `.blog-article-content` so the
 * prose styles apply.
 */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const props = { id: block.id, dangerouslySetInnerHTML: { __html: block.html } };
            if (block.level === 2) return <h2 key={index} {...props} />;
            if (block.level === 3) return <h3 key={index} {...props} />;
            return <h4 key={index} {...props} />;
          }
          case "paragraph":
            return <p key={index} dangerouslySetInnerHTML={{ __html: block.html }} />;
          case "list":
            return block.ordered ? (
              <ol key={index}>
                {block.items.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ol>
            ) : (
              <ul key={index}>
                {block.items.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );
          case "quote":
            return <blockquote key={index} dangerouslySetInnerHTML={{ __html: block.html }} />;
          case "code":
            return (
              <pre key={index}>
                <code>{block.code}</code>
              </pre>
            );
          case "table":
            return (
              <table key={index}>
                {block.head.length > 0 ? (
                  <thead>
                    <tr>
                      {block.head.map((cell, i) => (
                        <th key={i} dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {block.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case "image":
            if (!block.src) return null;
            return (
              <MediaImage
                key={index}
                media={{
                  url: block.src,
                  alt: block.alt ?? "",
                  caption: block.caption,
                  width: block.width,
                  height: block.height,
                }}
                sizes="(min-width:1024px) 720px, 100vw"
                showCaption
              />
            );
          case "divider":
            return <hr key={index} className="my-8 border-border-subtle" />;
          default:
            return null;
        }
      })}
    </>
  );
}
