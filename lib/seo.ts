export const siteUrl = "https://aiverseworld.com";
export const siteName = "AiverseWorld";
export const siteDescription = "Discover, compare, and shortlist AI tools across writing, coding, video, research, and productivity.";
export const defaultOgImage = `${siteUrl}/logo.png`;

export const defaultOpenGraphImage = {
  url: defaultOgImage,
  alt: `${siteName} logo`,
};

export function buildUrl(path: string) {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

export function buildToolMeta(tool: {
  name: string;
  slug: string;
  shortDescription: string;
  summary?: string;
  category: string;
  company: string;
  rating?: number;
  reviewCount?: number;
  startingPriceUsd: number | null;
  pricingModel: string;
}) {
  const title = `${tool.name} Review & Pricing ${new Date().getFullYear()} | ${siteName}`;
  const description = tool.summary
    ? tool.summary.slice(0, 155)
    : `${tool.shortDescription} Compare pricing, features, and alternatives on ${siteName}.`;
  const url = buildUrl(`/tool/${tool.slug}`);
  return { title, description, url };
}

export function buildCategoryMeta(name: string, slug: string, description: string) {
  const title = `Best ${name} AI Tools ${new Date().getFullYear()} | ${siteName}`;
  const desc = description.slice(0, 155);
  return { title, description: desc, url: buildUrl(`/category/${slug}`) };
}

export function buildComparisonMeta(leftName: string, rightName: string, slug: string) {
  const title = `${leftName} vs ${rightName} ${new Date().getFullYear()} — Side-by-Side Comparison | ${siteName}`;
  const description = `Compare ${leftName} and ${rightName} on pricing, features, platforms, and use cases. Find the best fit for your workflow.`;
  return { title, description, url: buildUrl(`/compare/${slug}`) };
}
