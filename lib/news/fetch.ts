import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";
import type { NewsArticle } from "@/lib/news";
import { newsSources, type RawNewsArticle } from "@/lib/news/sources";

const USER_AGENT = "AiverseWorld-News-Radar";
const MAX_OG_FETCHES = 40;

type BackendNewsResponse = {
  data?: NewsArticle[];
};

function decodeEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(value: string) {
  return decodeEntities(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tagValue(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1] ? decodeEntities(match[1]).trim() : "";
}

function attrValue(value: string, attr: string) {
  return value.match(new RegExp(`${attr}=["']([^"']+)["']`, "i"))?.[1] ?? "";
}

function firstRssImage(item: string) {
  const media = item.match(/<(?:media:content|media:thumbnail)\b[^>]*(?:url=["'][^"']+["'])[^>]*>/i)?.[0];
  if (media) return attrValue(media, "url");

  const enclosure = item.match(/<enclosure\b[^>]*(?:url=["'][^"']+["'])[^>]*>/i)?.[0];
  if (enclosure) return attrValue(enclosure, "url");

  const description = tagValue(item, "description") || tagValue(item, "content:encoded");
  return description.match(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1] ?? "";
}

function entryBlocks(xml: string) {
  const items = Array.from(xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)).map((match) => ({
    type: "rss" as const,
    xml: match[0],
  }));
  const entries = Array.from(xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)).map((match) => ({
    type: "atom" as const,
    xml: match[0],
  }));
  return [...items, ...entries];
}

function entryLink(entry: string, sourceUrl: string) {
  const atomAlternate =
    entry.match(/<link\b(?=[^>]*rel=["']alternate["'])(?=[^>]*href=["'][^"']+["'])[^>]*>/i)?.[0] ??
    entry.match(/<link\b(?=[^>]*href=["'][^"']+["'])[^>]*>/i)?.[0];
  const atomHref = atomAlternate ? attrValue(atomAlternate, "href") : "";
  const rssLink = tagValue(entry, "link") || tagValue(entry, "guid");
  return absoluteUrl(atomHref || rssLink, sourceUrl);
}

function entrySummary(entry: string) {
  return stripHtml(
    tagValue(entry, "description") ||
      tagValue(entry, "summary") ||
      tagValue(entry, "content") ||
      tagValue(entry, "content:encoded"),
  );
}

function entryPublishedAt(entry: string) {
  return tagValue(entry, "pubDate") || tagValue(entry, "published") || tagValue(entry, "updated");
}

function absoluteUrl(value: string, baseUrl: string) {
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
}

function isHttpsUrl(value?: string | null) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: 0 },
  });
  if (!response.ok) return "";
  return response.text();
}

async function extractOgImage(url: string) {
  const html = await fetchText(url).catch(() => "");
  if (!html) return "";
  const match =
    html.match(/<meta\b[^>]*(?:property|name)=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i) ??
    html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']og:image["'][^>]*>/i);
  return match?.[1] ? absoluteUrl(decodeEntities(match[1]), url) : "";
}

async function hasUsableImage(imageUrl: string) {
  if (!isHttpsUrl(imageUrl)) return false;

  let response = await fetch(imageUrl, {
    method: "HEAD",
    headers: { "User-Agent": USER_AGENT },
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok || !(response.headers.get("content-type") ?? "").toLowerCase().startsWith("image/")) {
    response = await fetch(imageUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Range: "bytes=0-1023",
      },
      cache: "no-store",
    }).catch(() => null);
  }

  if (!response?.ok) return false;
  return (response.headers.get("content-type") ?? "").toLowerCase().startsWith("image/");
}

async function fetchBackendNews() {
  const response = await fetch(`${AIVERSE_WORLD_BASE_URL}/api/news?limit=150`, {
    cache: "no-store",
  }).catch(() => null);
  if (!response?.ok) return [];

  const payload = (await response.json().catch(() => null)) as BackendNewsResponse | null;
  return (payload?.data ?? []).map<RawNewsArticle>((article) => ({
    title: article.title,
    url: article.sourceUrl,
    sourceName: article.sourceName,
    excerpt: article.excerpt,
    summary: article.summary,
    category: article.category,
    imageUrl: article.imageUrl,
    publishedAt: article.publishedAt,
  }));
}

async function fetchRssSource(source: (typeof newsSources)[number]) {
  const xml = await fetchText(source.rssUrl).catch(() => "");
  if (!xml) return [];

  return entryBlocks(xml)
    .slice(0, 60)
    .map((entry) => {
      const item = entry.xml;
      const url = entryLink(item, source.rssUrl);
      const summary = entrySummary(item);
      return {
        title: stripHtml(tagValue(item, "title")),
        url,
        sourceName: source.name,
        excerpt: summary.slice(0, 180),
        summary: summary.slice(0, 240),
        category: source.category,
        imageUrl: absoluteUrl(firstRssImage(item), source.rssUrl),
        publishedAt: entryPublishedAt(item),
      } satisfies RawNewsArticle;
    })
    .filter((article) => article.title && article.url);
}

function normalizeArticle(article: RawNewsArticle, index: number): NewsArticle {
  const publishedAt = article.publishedAt ? new Date(article.publishedAt) : new Date();
  const safePublishedAt = Number.isNaN(publishedAt.getTime()) ? new Date() : publishedAt;
  const summary = article.summary || article.excerpt || `Latest AI update from ${article.sourceName}.`;

  return {
    id: `${article.sourceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80),
    sourceName: article.sourceName,
    sourceUrl: article.url,
    title: article.title,
    excerpt: article.excerpt || summary.slice(0, 180),
    summary,
    keyPoints: [],
    category: article.category || "AI News",
    imageUrl: article.imageUrl ?? "",
    publishedAt: safePublishedAt.toISOString(),
    processedAt: new Date().toISOString(),
    legal: {
      attributionRequired: true,
      copyrightOwner: article.sourceName,
      summaryOnly: true,
      takedownEmail: "contact@aiverseworld.com",
    },
  };
}

function dedupeArticles(articles: RawNewsArticle[]) {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = article.url.toLowerCase().replace(/[#?].*$/, "") || article.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchImageReadyNewsArticles() {
  const rssResults = await Promise.all(newsSources.map(fetchRssSource));
  const rawArticles = dedupeArticles([...(await fetchBackendNews()), ...rssResults.flat()])
    .filter((article) => article.title && article.url)
    .slice(0, 300);

  let ogFetches = 0;
  const imageReady: RawNewsArticle[] = [];

  for (const article of rawArticles) {
    let imageUrl = article.imageUrl ?? "";
    if (!isHttpsUrl(imageUrl) && ogFetches < MAX_OG_FETCHES) {
      ogFetches += 1;
      imageUrl = await extractOgImage(article.url).catch(() => "");
    }

    if (!(await hasUsableImage(imageUrl))) continue;
    imageReady.push({ ...article, imageUrl });
    if (imageReady.length >= 100) break;
  }

  return imageReady
    .sort((left, right) => new Date(right.publishedAt ?? 0).getTime() - new Date(left.publishedAt ?? 0).getTime())
    .map(normalizeArticle);
}
