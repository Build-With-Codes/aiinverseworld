import type { Category } from "@/lib/catalog-types";
import type { FAQItem } from "@/components/ui/faq-accordion";

export type CategoryContent = {
  intro: string;
  explanation: string;
  buyingGuide: string[];
  faqs: FAQItem[];
};

const knownCategories: Record<string, CategoryContent> = {
  "ai-assistant": {
    intro:
      "AI assistants are the generalists of the AI tool world — a single chat interface that can answer questions, draft writing, reason through problems, and increasingly take actions on your behalf. The category spans everything from consumer chat apps to assistants wired into enterprise knowledge bases.",
    explanation:
      "What separates one assistant from another usually comes down to three things: the underlying model quality, how well it handles long or messy context, and whether it can call tools or browse the web to stay current. Pricing tends to follow a freemium curve, with the best reasoning and longest context windows gated behind a paid tier.",
    buyingGuide: [
      "Test the free tier with a real task from your own workflow before paying — benchmark scores rarely predict how a model handles your specific writing style or domain.",
      "Check whether the assistant can browse the web or connect to your documents; a static knowledge cutoff is a dealbreaker for anything time-sensitive.",
      "If you need it for a team, confirm seat-based pricing and admin controls exist — many assistants are priced for individuals first.",
    ],
    faqs: [
      { question: "Are AI assistants safe to use with sensitive information?", answer: "Treat any assistant's free or default tier as non-confidential unless the vendor explicitly states otherwise in its privacy policy — enterprise tiers usually add data-retention controls." },
      { question: "Do I need to pay to get useful results?", answer: "Free tiers are usually good enough for casual questions and short drafts; paid tiers matter most for longer context windows, faster responses, and more advanced reasoning." },
    ],
  },
  "coding-assistant": {
    intro:
      "Coding assistants have moved past simple autocomplete — the strongest tools in this category now read your whole repository, run tests, and can carry out multi-step changes with minimal supervision. The gap between a basic completion tool and an autonomous coding agent is now the main axis to evaluate on.",
    explanation:
      "Look past marketing claims about \"agentic\" behavior and check three concrete things: which models power the tool (and whether you can swap them), how it handles large codebases without losing context, and whether it integrates with your existing editor or CI pipeline instead of demanding a new one.",
    buyingGuide: [
      "Run it against a real ticket from your backlog, not a toy example — autocomplete quality on short snippets doesn't predict performance on a multi-file change.",
      "Check pricing per seat versus per-token usage; heavy users on usage-based plans can get expensive fast.",
      "Verify whether generated code and prompts are used for further model training if you work with proprietary codebases.",
    ],
    faqs: [
      { question: "Can coding assistants replace a developer?", answer: "Not yet for most production work — they're strongest as a force multiplier for boilerplate, refactors, and first-draft implementations that a developer still reviews." },
      { question: "Do these tools work with private repositories?", answer: "Most do, either via a local extension or a scoped integration — check the vendor's data-handling policy before connecting anything proprietary." },
    ],
  },
  "writing-assistant": {
    intro:
      "Writing assistants range from grammar and clarity checkers to full drafting engines that can produce a blog post, email, or script from a short brief. The category is crowded, so the useful distinction is between tools that edit your writing and tools that generate it from scratch.",
    explanation:
      "The best writing tools let you set a tone and audience once and apply it consistently, rather than requiring a fresh prompt every time. SEO-oriented writing tools add keyword and structure guidance on top of drafting, which matters if content marketing is the primary use case.",
    buyingGuide: [
      "Feed it a paragraph in your actual voice and see how well it preserves tone when editing, not just when generating from scratch.",
      "If SEO output matters, check whether it integrates with a real keyword-research source or just guesses based on the prompt.",
      "Plagiarism and AI-detection sensitivity vary a lot — verify the tool's originality checker (if any) against your publisher's requirements.",
    ],
    faqs: [
      { question: "Will AI-written content get flagged by search engines?", answer: "Search engines generally rank for quality and usefulness, not authorship method — thin, unedited AI output is what gets penalized, not AI assistance itself." },
      { question: "Can I use these tools for long-form content?", answer: "Yes, though most produce stronger results when used for outlining and section drafts that a human then assembles and edits, rather than a single one-shot long article." },
    ],
  },
  "image-generation": {
    intro:
      "Image generation tools turn text prompts (and increasingly reference images) into original artwork, product renders, or photorealistic scenes. Quality has converged across the top vendors, so the real differentiators are licensing terms, editing controls, and how well the tool follows detailed prompts.",
    explanation:
      "Commercial usage rights differ meaningfully between vendors — some grant full commercial rights on paid plans, others restrict certain use cases. Editing features like inpainting, style consistency across a series, and upscaling are what separate a hobbyist tool from one usable in a production pipeline.",
    buyingGuide: [
      "Read the commercial license terms directly, not just the marketing page — restrictions on ads, resale, or trademarked content vary widely.",
      "Test consistency across multiple generations of the same subject if you need a coherent visual series, not just one strong image.",
      "Check output resolution and upscaling options against what your final use case actually requires.",
    ],
    faqs: [
      { question: "Can I use AI-generated images commercially?", answer: "Usually yes on a paid plan, but confirm the specific license — some vendors exclude certain use cases like trademarks or resale of the raw output." },
      { question: "Do these tools train on my uploaded images?", answer: "Policies vary by vendor and plan tier — check whether uploads are used for model training and whether you can opt out." },
    ],
  },
  "video-generation": {
    intro:
      "AI video generation has moved from short, glitchy clips to coherent scenes with consistent characters and camera motion. This category still has the widest quality gap between vendors of any AI tool space, so hands-on testing matters more here than almost anywhere else.",
    explanation:
      "Clip length limits, rendering time, and credit-based pricing are the practical constraints that matter day to day. If you need talking-head or avatar-style video specifically, that's usually a distinct sub-category from general text-to-video generation.",
    buyingGuide: [
      "Generate the same prompt on two or three vendors before committing — visual quality and prompt adherence vary enormously between them.",
      "Check the credit system carefully; a single high-resolution clip can consume a disproportionate share of a monthly allowance.",
      "If motion consistency across cuts matters for your project, look specifically for character- or scene-consistency features rather than one-off generation.",
    ],
    faqs: [
      { question: "How long can AI-generated videos be?", answer: "Most tools cap individual clips at a few seconds to a couple of minutes; longer content usually means generating and stitching multiple clips together." },
      { question: "Is AI video good enough for professional production?", answer: "It's increasingly used for pre-visualization, social content, and B-roll; fully polished, long-form production work still typically needs human editing on top." },
    ],
  },
};

function toTitleCase(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function fallbackContent(category: Category): CategoryContent {
  const name = category.name || toTitleCase(category.slug);
  const lower = name.toLowerCase();

  return {
    intro: `${name} is one of the faster-moving corners of the AI tool market, with ${category.count} tools currently tracked in this catalog. Rather than one dominant product, the space is split between a handful of well-funded leaders and a long tail of focused, single-purpose tools.`,
    explanation: `Most ${lower} tools compete on three things: how much setup they require before they're useful, how well they fit into tools you already use, and how transparent their pricing is once you outgrow the free tier. A quick trial against a real task from your own workflow tells you more than any feature comparison chart.`,
    buyingGuide: [
      `Shortlist two or three ${lower} tools and run the same real task through each before picking one — feature lists rarely predict day-to-day fit.`,
      "Check the pricing model closely: usage-based plans can look cheap at first and scale unpredictably once you're a regular user.",
      "Confirm data handling and retention policies if the tool will touch anything proprietary or customer-facing.",
    ],
    faqs: [
      {
        question: `What should I look for in a ${lower} tool?`,
        answer: `Prioritize tools that solve your specific use case well rather than the one with the longest feature list — ${lower} tools vary a lot in what they're actually best at.`,
      },
      {
        question: `Are there free ${lower} tools worth using?`,
        answer: `Yes — several tools in this category offer a usable free tier; check the comparison and best-tools list below for ones with a "Free plan" badge.`,
      },
    ],
  };
}

export function getCategoryContent(category: Category): CategoryContent {
  return knownCategories[category.slug] ?? fallbackContent(category);
}
