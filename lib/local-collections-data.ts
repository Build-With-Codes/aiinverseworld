import type { AITool, CollectionDetail, CollectionSummary } from "@/lib/catalog-types";
import { getLocalToolBySlug, queryLocalTools } from "@/lib/local-tools-data";

// ── Offline fallback collections ──────────────────────────────────────────
// Ported verbatim from the backend's src/tools/collections.config.ts — real,
// hand-authored editorial copy that lives in that repo's source code, not a
// database table. Using it here isn't fabrication: it's the same real
// content, just resolved against the local tool catalog instead of a live
// DB query when the backend is unreachable.

type CollectionFaq = { question: string; answer: string };

type CollectionDef = {
  slug: string;
  emoji: string;
  title: string;
  tagline: string;
  intro: string;
  body: string[];
  buyingGuide: string[];
  faqs: CollectionFaq[];
  seoTitle: string;
  seoDescription: string;
  toolSlugs?: string[];
  categories?: string[];
  filter?: { freeOnly?: boolean; openSourceOnly?: boolean };
  limit?: number;
};

const collectionDefs: CollectionDef[] = [
  {
    slug: "best-ai-tools-2026",
    emoji: "🌟",
    title: "Best AI Tools of 2026",
    tagline: "The definitive shortlist across every major category.",
    intro:
      "These are the AI tools our editors return to again and again — the ones that combine genuine capability, sane pricing, and staying power. If you only try a handful of tools this year, start here.",
    body: [
      "We weigh three things heavily: how reliably a tool does its core job, how transparent its pricing is once you outgrow the free tier, and how well it fits into the tools teams already use. Flashy demos are cheap; dependable daily-driver software is rare.",
      "The list spans assistants, coding, writing, image, video, and productivity so there is something here whether you are a solo creator or rolling AI out across a company.",
    ],
    buyingGuide: [
      "Pick one tool per job to start — stacking five overlapping tools is how subscriptions quietly balloon.",
      "Trial the free tier against a real task from your own week before paying for anything.",
      "Check data-handling terms before connecting anything proprietary.",
    ],
    faqs: [
      {
        question: "How is this list chosen?",
        answer:
          "Editorially, weighted by real capability, pricing clarity, adoption, and community rating — not by who pays us.",
      },
      {
        question: "How often is it updated?",
        answer: "It is reviewed continuously as tools ship major changes and as new standouts emerge.",
      },
    ],
    seoTitle: "Best AI Tools of 2026 — Editor-Curated Shortlist | AiverseWorld",
    seoDescription:
      "The best AI tools of 2026 across assistants, coding, writing, image, video, and productivity — curated with real pricing and use cases.",
    categories: ["AI Assistant", "Coding Assistant", "Writing Assistant", "Image Generation", "Video Generation"],
    limit: 15,
  },
  {
    slug: "top-free-ai-tools",
    emoji: "🆓",
    title: "Top Free AI Tools",
    tagline: "Genuinely useful AI you can use without paying a cent.",
    intro:
      "Free AI tools have gotten shockingly good. This collection gathers the ones with a real free tier — not a crippled trial — that hold up for everyday work.",
    body: [
      "A good free tier is one you could keep using indefinitely for light-to-moderate use. We favor tools where the free plan is a genuine on-ramp, not a two-minute tease before a paywall.",
      "Many of these also have paid plans worth upgrading to later — but you can get real value first.",
    ],
    buyingGuide: [
      "Watch for usage caps (messages, credits, exports) that reset monthly.",
      "Free tiers sometimes train on your inputs — check if that matters for your use.",
      "If a free tool becomes core to your workflow, the paid tier is usually worth it for limits and speed.",
    ],
    faqs: [
      {
        question: "Are free AI tools safe to use?",
        answer: "Generally yes for non-sensitive work; treat free tiers as non-confidential unless the vendor states otherwise.",
      },
      {
        question: "Do free tools have catches?",
        answer: "Usually usage limits or slower performance rather than missing core features. Read the plan comparison.",
      },
    ],
    seoTitle: "Top Free AI Tools — Genuinely Useful & No Cost | AiverseWorld",
    seoDescription: "The best free AI tools with real free tiers, for writing, coding, images, and productivity — no crippled trials.",
    filter: { freeOnly: true },
    limit: 15,
  },
  {
    slug: "best-chatgpt-alternatives",
    emoji: "🔄",
    title: "Best ChatGPT Alternatives",
    tagline: "Strong assistants worth trying alongside or instead of ChatGPT.",
    intro:
      "ChatGPT is excellent, but it is not the only capable assistant — and the right alternative can be better for your specific needs around reasoning, privacy, context length, or price.",
    body: [
      "The assistants here differ most in reasoning quality on hard tasks, how much context they hold, whether they browse the web, and their data policies. The best way to choose is to run the same real prompt through two or three of them.",
      "Several are free to try, so comparing them costs nothing but a few minutes.",
    ],
    buyingGuide: [
      "Test with your actual work, not benchmark-style questions.",
      "Check context window and whether it can access current information.",
      "For sensitive work, prioritize assistants with clear enterprise data controls.",
    ],
    faqs: [
      { question: "Is there a free ChatGPT alternative?", answer: "Yes — several assistants in this list offer capable free tiers." },
      {
        question: "Which alternative is best?",
        answer: "It depends on your use case; compare reasoning quality, context length, and price against your real tasks.",
      },
    ],
    seoTitle: "Best ChatGPT Alternatives in 2026 | AiverseWorld",
    seoDescription: "The best ChatGPT alternatives compared — capable AI assistants for reasoning, writing, and research, with pricing and free tiers.",
    categories: ["AI Assistant"],
    limit: 12,
  },
  {
    slug: "best-ai-image-generators",
    emoji: "🎨",
    title: "Best AI Image Generators",
    tagline: "Top tools for turning prompts into original visuals.",
    intro:
      "Image quality has converged across the leaders, so the real differences now are licensing, editing controls, and how faithfully each tool follows a detailed prompt.",
    body: [
      "If you are generating images commercially, the licensing terms matter as much as the output quality — read them before you build a workflow around any one tool.",
      "Editing features like inpainting, consistent characters across a series, and upscaling separate hobbyist tools from production-ready ones.",
    ],
    buyingGuide: [
      "Confirm commercial-use rights on the plan you intend to buy.",
      "Test prompt adherence and consistency, not just a single hero image.",
      "Check max resolution and upscaling against your final use.",
    ],
    faqs: [
      { question: "Can I use AI images commercially?", answer: "Usually on paid plans, but confirm the license — some vendors restrict certain uses." },
      { question: "Which generator is most realistic?", answer: "Top tools are close; test the same prompt across a few to see which suits your style." },
    ],
    seoTitle: "Best AI Image Generators of 2026 | AiverseWorld",
    seoDescription: "The best AI image generators compared — quality, licensing, and editing controls for creators and marketers.",
    categories: ["Image Generation"],
    limit: 12,
  },
  {
    slug: "ai-tools-for-students",
    emoji: "🎓",
    title: "AI Tools for Students",
    tagline: "Study smarter — research, writing, and learning helpers.",
    intro:
      "Used well, AI is a genuinely great study partner: it can explain hard concepts, summarize dense readings, and help you draft and revise. Used badly, it does your thinking for you. This collection favors tools that help you learn.",
    body: [
      "The most useful student tools summarize and explain rather than just generate — they help you understand material faster and organize what you know.",
      "Most have free tiers that are perfectly adequate on a student budget.",
    ],
    buyingGuide: [
      "Prefer tools that cite sources or show their reasoning so you can verify.",
      "Check your institution's academic-integrity policy on AI assistance.",
      "Look for student discounts on paid plans.",
    ],
    faqs: [
      { question: "Is using AI for studying cheating?", answer: "Using it to understand and organize material is fine; submitting AI-written work as your own usually is not — check your institution's policy." },
      { question: "Are there free tools for students?", answer: "Yes — many tools here have free tiers well-suited to coursework." },
    ],
    seoTitle: "Best AI Tools for Students in 2026 | AiverseWorld",
    seoDescription: "The best AI tools for students — research, summarizing, writing, and study helpers, most with free tiers.",
    categories: ["AI Assistant", "Writing Assistant", "Research", "Note-taking"],
    limit: 12,
  },
  {
    slug: "ai-tools-for-developers",
    emoji: "💻",
    title: "AI Tools for Developers",
    tagline: "Copilots, agents, and coding assistants that ship.",
    intro:
      "The strongest developer tools now read whole repositories, run tests, and carry out multi-step changes. This collection covers the coding assistants and agents worth putting in your workflow.",
    body: [
      "The main axis to evaluate on is how much autonomy a tool has — from inline completion to full agentic changes — and how well it fits your existing editor and CI instead of demanding a new one.",
      "Run each candidate against a real ticket from your backlog; completion quality on snippets rarely predicts performance on a multi-file change.",
    ],
    buyingGuide: [
      "Test on a real task, not a toy example.",
      "Check per-seat vs usage-based pricing for heavy use.",
      "Verify how your code and prompts are handled for private repos.",
    ],
    faqs: [
      { question: "Can these replace a developer?", answer: "Not for most production work — they are strongest as a force multiplier a developer still reviews." },
      { question: "Do they work with private repositories?", answer: "Most do via a local extension or scoped integration — check the data-handling policy first." },
    ],
    seoTitle: "Best AI Tools for Developers in 2026 | AiverseWorld",
    seoDescription: "The best AI coding tools for developers — copilots, autonomous agents, and assistants, compared with pricing.",
    categories: ["Coding Assistant"],
    limit: 12,
  },
];

// The collection defs reference the live backend's category taxonomy, which
// is more granular than this static CSV's coarser categories (e.g. the CSV
// has one "Coding" bucket where the live DB splits out "Coding Assistant").
// Bridges the two so resolution actually finds real tools instead of
// silently coming up empty on a name that technically doesn't exist locally.
const categoryAliases: Record<string, string> = {
  "coding assistant": "Coding",
  "writing assistant": "Writing",
};

function resolveCollectionTools(def: CollectionDef): AITool[] {
  if (def.toolSlugs?.length) {
    return def.toolSlugs.map((slug) => getLocalToolBySlug(slug)).filter((tool): tool is AITool => Boolean(tool));
  }

  const limit = def.limit ?? 12;
  const categories = def.categories?.length ? def.categories : [undefined];
  const seen = new Set<string>();
  const tools: AITool[] = [];

  for (const category of categories) {
    const resolvedCategory = category ? categoryAliases[category.toLowerCase()] ?? category : category;
    const result = queryLocalTools({
      category: resolvedCategory,
      freeOnly: def.filter?.freeOnly,
      openSourceOnly: def.filter?.openSourceOnly,
      limit: 100,
      sort: "popular",
    });
    for (const tool of result.data) {
      if (seen.has(tool.id)) continue;
      seen.add(tool.id);
      tools.push(tool);
      if (tools.length >= limit) return tools;
    }
  }

  return tools;
}

export function getLocalCollections(): CollectionSummary[] {
  return collectionDefs.map(({ slug, emoji, title, tagline }) => ({ slug, emoji, title, tagline }));
}

export function getLocalCollection(slug: string): CollectionDetail | null {
  const def = collectionDefs.find((c) => c.slug === slug);
  if (!def) return null;

  return {
    slug: def.slug,
    emoji: def.emoji,
    title: def.title,
    tagline: def.tagline,
    intro: def.intro,
    body: def.body,
    buyingGuide: def.buyingGuide,
    faqs: def.faqs,
    seoTitle: def.seoTitle,
    seoDescription: def.seoDescription,
    tools: resolveCollectionTools(def),
  };
}

export function getLocalCollectionSeo(slug: string): { title: string; description: string } | null {
  const def = collectionDefs.find((c) => c.slug === slug);
  return def ? { title: def.seoTitle, description: def.seoDescription } : null;
}
