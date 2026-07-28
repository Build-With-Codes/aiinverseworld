import { getPromptBySlug } from "@/lib/prompts-api";
import { apiGet } from "@/lib/api-service";
import { buildUrl, defaultOgImage } from "@/lib/seo";
import { AIVERSE_JOBS_BASE_URL } from "@/lib/service-urls";
import type { BackendSeo } from "@/lib/seo/types";

type RouteSeoInput = {
  title: string;
  description: string;
  keywords?: string[];
};

const routeSeo: Record<string, RouteSeoInput> = {
  "/": {
    title: "AiverseWorld | AI Tools, Jobs, Prompts, News & Guides",
    description: "Discover AI tools, compare software, explore AI jobs, browse production-ready prompts, and read practical AI guides.",
    keywords: ["AI tools", "AI jobs", "AI prompts", "AI news", "AI tool directory"],
  },
  "/about": {
    title: "About AiverseWorld | AI Tool Discovery Platform",
    description: "Learn how AiverseWorld helps people discover, compare, and evaluate AI tools, jobs, prompts, and learning resources.",
    keywords: ["about AiverseWorld", "AI discovery", "AI comparison platform"],
  },
  "/contact": {
    title: "Contact AiverseWorld | Support & Partnerships",
    description: "Contact AiverseWorld for support, partnerships, corrections, AI tool submissions, and business inquiries.",
    keywords: ["contact AiverseWorld", "AI tool submission", "AI directory support"],
  },
  "/blog": {
    title: "AI Blog | AiverseWorld",
    description: "Read practical AI guides, tool comparisons, prompt strategies, product updates, and software buying advice.",
    keywords: ["AI blog", "AI guides", "AI tool reviews", "prompt engineering"],
  },
  "/news": {
    title: "AI News | AiverseWorld",
    description: "Follow AI product launches, policy updates, infrastructure news, funding signals, and market changes.",
    keywords: ["AI news", "AI product launches", "AI industry updates"],
  },
  "/prompts": {
    title: "AI Prompt Workspace | Search, Copy & Save Prompts",
    description: "Search, copy, save, and customize production-ready prompts for marketing, coding, support, content, and AI agents.",
    keywords: ["AI prompts", "prompt library", "prompt engineering", "ChatGPT prompts", "Claude prompts"],
  },
  "/collections": {
    title: "AI Tool Collections | AiverseWorld",
    description: "Browse curated AI tool collections for creators, developers, students, marketers, startups, and teams.",
    keywords: ["AI tool collections", "best AI tools", "curated AI tools"],
  },
  "/best-ai-tools": {
    title: "Best AI Tools 2026 | AiverseWorld",
    description: "Explore editor-curated AI tools across writing, coding, image, video, research, automation, and productivity.",
    keywords: ["best AI tools", "AI tools 2026", "AI software directory"],
  },
  "/free-ai-tools": {
    title: "Free AI Tools | AiverseWorld",
    description: "Find useful free AI tools and freemium AI software for writing, coding, design, video, research, and productivity.",
    keywords: ["free AI tools", "freemium AI software", "best free AI tools"],
  },
  "/ai-writing-tools": {
    title: "Best AI Writing Tools | AiverseWorld",
    description: "Compare AI writing tools for content creation, copywriting, grammar, editing, and SEO workflows.",
    keywords: ["AI writing tools", "AI copywriting tools", "AI content tools"],
  },
  "/ai-coding-tools": {
    title: "Best AI Coding Tools | AiverseWorld",
    description: "Compare AI coding assistants, AI IDEs, code completion tools, and developer productivity software.",
    keywords: ["AI coding tools", "AI code assistant", "developer AI tools"],
  },
  "/ai-video-tools": {
    title: "Best AI Video Tools | AiverseWorld",
    description: "Compare AI video generators, editing tools, avatar video platforms, and social video creation software.",
    keywords: ["AI video tools", "AI video generator", "AI avatar video"],
  },
  "/ai-marketing-tools": {
    title: "Best AI Marketing Tools | AiverseWorld",
    description: "Compare AI marketing tools for ads, SEO, campaigns, email, content strategy, and growth workflows.",
    keywords: ["AI marketing tools", "AI SEO tools", "AI campaign tools"],
  },
  "/ai-productivity-tools": {
    title: "Best AI Productivity Tools | AiverseWorld",
    description: "Compare AI productivity tools for meetings, documents, planning, automation, research, and team workflows.",
    keywords: ["AI productivity tools", "AI meeting tools", "AI automation tools"],
  },
  "/faq": {
    title: "AiverseWorld FAQ | AI Tool Discovery Help",
    description: "Find answers about AiverseWorld, AI tool listings, reviews, saved tools, comparisons, and discovery features.",
    keywords: ["AiverseWorld FAQ", "AI tool directory help", "AI tools questions"],
  },
  "/premium": {
    title: "AiverseWorld Premium | Advanced AI Discovery",
    description: "Unlock advanced AI discovery, richer comparisons, saved workflows, and premium research features.",
    keywords: ["AiverseWorld premium", "AI discovery premium", "AI tool research"],
  },
  "/problems": {
    title: "Business Problems | Find AI Solutions",
    description: "Browse practical business problems and discover AI tools, workflows, and resources that can help solve them.",
    keywords: ["AI business problems", "AI solutions", "workflow automation"],
  },
  "/problems/submit": {
    title: "Submit a Business Problem | AiverseWorld",
    description: "Share a business problem and help AiverseWorld map real-world needs to useful AI tools and workflows.",
    keywords: ["submit business problem", "AI solution request", "AI workflow help"],
  },
  "/english-speaking-tutor": {
    title: "AI English Speaking Tutor | AiverseWorld",
    description: "Practice English conversation with an AI speaking tutor designed for fluency, confidence, and daily improvement.",
    keywords: ["AI English tutor", "English speaking practice", "AI language tutor"],
  },
  "/terms": {
    title: "Terms of Service | AiverseWorld",
    description: "Read the terms that govern use of AiverseWorld's AI tool directory, content, accounts, and services.",
    keywords: ["AiverseWorld terms", "terms of service"],
  },
  "/privacy": {
    title: "Privacy Policy | AiverseWorld",
    description: "Read how AiverseWorld handles personal data, cookies, analytics, accounts, and privacy rights.",
    keywords: ["AiverseWorld privacy", "privacy policy"],
  },
  "/cookie-policy": {
    title: "Cookie Policy | AiverseWorld",
    description: "Learn how AiverseWorld uses cookies, consent, analytics, advertising technologies, and preference controls.",
    keywords: ["cookie policy", "AiverseWorld cookies", "cookie consent"],
  },
  "/security": {
    title: "Security | AiverseWorld",
    description: "Review AiverseWorld security practices for accounts, data handling, infrastructure, and responsible disclosure.",
    keywords: ["AiverseWorld security", "security policy"],
  },
  "/dmca": {
    title: "DMCA Policy | AiverseWorld",
    description: "Review AiverseWorld's DMCA process for copyright concerns, takedown requests, and content disputes.",
    keywords: ["DMCA policy", "copyright takedown"],
  },
  "/copyright": {
    title: "Copyright Policy | AiverseWorld",
    description: "Read AiverseWorld's copyright policy for site content, submissions, media, and intellectual property.",
    keywords: ["copyright policy", "AiverseWorld copyright"],
  },
  "/disclaimer": {
    title: "Disclaimer | AiverseWorld",
    description: "Read AiverseWorld disclaimers about AI tools, content accuracy, affiliate links, and professional advice.",
    keywords: ["AiverseWorld disclaimer", "AI tools disclaimer"],
  },
  "/advertising-disclosure": {
    title: "Advertising Disclosure | AiverseWorld",
    description: "Learn how AiverseWorld discloses advertising, sponsored placements, affiliate relationships, and monetization.",
    keywords: ["advertising disclosure", "AiverseWorld ads"],
  },
  "/affiliate-disclosure": {
    title: "Affiliate Disclosure | AiverseWorld",
    description: "Read how affiliate links and commercial relationships may appear across AiverseWorld.",
    keywords: ["affiliate disclosure", "AiverseWorld affiliate links"],
  },
  "/games/hand-detect": {
    title: "Hand Detection Game | AiverseWorld",
    description: "Try an interactive hand detection game that demonstrates AI-assisted browser experiences.",
    keywords: ["hand detection game", "AI browser game"],
  },
  "/games/draw-guess": {
    title: "Draw & Guess AI Game | AiverseWorld",
    description: "Play a drawing and guessing game inspired by AI creativity, visual reasoning, and quick sketches.",
    keywords: ["AI drawing game", "draw guess game"],
  },
};

async function getWorldSeo(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const payload = await apiGet<{ data?: BackendSeo | null }>(
    `/api/seo?${searchParams.toString()}`,
    { revalidate: 300, timeoutMs: 5000 },
  );
  return payload?.data ?? null;
}

async function getJobSeo(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  try {
    const response = await fetch(`${AIVERSE_JOBS_BASE_URL}/seo?${searchParams.toString()}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: BackendSeo | null };
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export async function getToolSeo(slug: string): Promise<BackendSeo | null> {
  return getWorldSeo({ type: "tool", slug });
}

export async function getPromptSeo(slug: string): Promise<BackendSeo | null> {
  const seo = await getJobSeo({ type: "prompt", slug });
  if (seo) return seo;
  const prompt = await getPromptBySlug(slug, { revalidate: 300, timeoutMs: 5000 });
  return prompt?.seo ?? null;
}

export async function getJobsSeo(): Promise<BackendSeo> {
  return (
    (await getJobSeo({ type: "jobs" })) ?? {
      title: "AI Jobs | AiverseWorld",
      description: "Search live AI, ML, data science, LLM, and automation roles from employer-backed job feeds.",
      keywords: ["AI jobs", "machine learning jobs", "LLM jobs", "data science jobs", "remote AI jobs"],
      canonical: buildUrl("/jobs"),
      ogImage: defaultOgImage,
    }
  );
}

export async function getSearchSeo(query?: string): Promise<BackendSeo> {
  return (
    (await getWorldSeo({ type: "search", query })) ?? {
      title: query ? `Search Results for ${query} | AiverseWorld` : "Search AI Tools | AiverseWorld",
      description: query
        ? `Search AiverseWorld for ${query} across AI tools, categories, pricing models, platforms, and workflow use cases.`
        : "Search and filter AI tools by category, pricing model, platform, API support, and workflow fit.",
      keywords: query
        ? [query, "AI tool search", "AI software directory"]
        : ["search AI tools", "AI tool finder", "compare AI tools", "AI software directory"],
      canonical: query ? buildUrl(`/search?q=${encodeURIComponent(query)}`) : buildUrl("/search"),
      ogImage: defaultOgImage,
    }
  );
}

export function getRouteSeo(path: string): BackendSeo {
  const route = routeSeo[path] ?? {
    title: "AiverseWorld",
    description: "Discover, compare, and shortlist AI tools, prompts, jobs, news, and learning resources.",
    keywords: ["AI tools", "AiverseWorld"],
  };

  return {
    title: route.title,
    description: route.description,
    keywords: route.keywords,
    canonical: buildUrl(path),
    ogImage: defaultOgImage,
  };
}

export async function getBlogPostSeo(slug: string): Promise<BackendSeo | null> {
  return getWorldSeo({ type: "blog", slug });
}

export async function getCategorySeo(slug: string): Promise<BackendSeo | null> {
  return getWorldSeo({ type: "category", slug });
}

export async function getCompareSeo(comparison: string): Promise<BackendSeo | null> {
  return getWorldSeo({ type: "compare", slug: comparison });
}

export async function getBestListSeo(slug: string): Promise<BackendSeo | null> {
  return getWorldSeo({ type: "best", slug });
}

export async function getCollectionSeo(slug: string): Promise<BackendSeo | null> {
  return getWorldSeo({ type: "collection", slug });
}

export async function getProblemSeo(id: string): Promise<BackendSeo | null> {
  return getWorldSeo({ type: "problem", id });
}
