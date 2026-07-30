import { buildUrl, siteDescription, siteName, siteUrl } from "@/lib/seo";
import { socialLinks } from "@/lib/social-links";

export function buildGlobalStructuredData() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: buildUrl("/logo.webp"),
      sameAs: socialLinks.map((link) => link.href),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      name: ["Discover", "Search", "AI Tools", "Prompt Tools", "Prompts", "Compare", "Categories", "News", "Blog"],
      url: [
        buildUrl("/"),
        buildUrl("/search"),
        buildUrl("/search"),
        buildUrl("/prompt-tools"),
        buildUrl("/prompts"),
        buildUrl("/compare"),
        buildUrl("/category"),
        buildUrl("/news"),
        buildUrl("/blog"),
      ],
    },
  ];
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
