/**
 * Lightweight defensive sanitizer for admin-authored HTML rendered via
 * dangerouslySetInnerHTML. Mirrors the backend's `sanitizeInline` in
 * aiverseworld-backend/src/blog/blog-blocks.ts, which already protects the
 * block-rendering path — this covers the legacy raw-HTML fallback
 * (`app/blog/[slug]/page.tsx`) that renders `contentHtml` directly when a
 * post hasn't been converted to structured blocks.
 *
 * This is not a full HTML sanitizer (no DOM-based allowlist parsing) — it's
 * a defense-in-depth regex strip of the classic injection vectors, matching
 * the backend's existing security posture rather than adding a new parsing
 * dependency for a single legacy code path. Content here is always
 * admin-authored (gated by ADMIN_API_KEY), never end-user submitted.
 */
export function sanitizeAdminHtml(html: string): string {
  return html
    // <script>/<style> blocks entirely
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    // inline event handlers: onclick="", onerror='', etc.
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    // javascript:/vbscript: URIs in href/src/etc.
    .replace(/(href|src|action|formaction)\s*=\s*"(?:\s|&#x?0*(?:9|10|13);?)*(javascript|vbscript):[^"]*"/gi, '$1="#"')
    .replace(/(href|src|action|formaction)\s*=\s*'(?:\s|&#x?0*(?:9|10|13);?)*(javascript|vbscript):[^']*'/gi, "$1='#'")
    // <iframe>, <object>, <embed> — no legitimate use in blog body copy
    .replace(/<\s*(iframe|object|embed)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(iframe|object|embed)\b[^>]*\/?>/gi, "");
}
