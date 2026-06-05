export type Review = {
  author: string;
  role: string;
  rating: number;
  comment: string;
};

export type ToolPricing = "Yes" | "Limited" | "No";

export type Tool = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categorySlug: string;
  website: string;
  faviconUrl: string;
  free: ToolPricing;
  startingPrice: string;
  description: string;
  useCases: string[];
  badge?: string;
  sponsored?: boolean;
};

export type Category = {
  name: string;
  slug: string;
  count: number;
  description: string;
};

export type Comparison = {
  slug: string;
  title: string;
  summary: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseUseCases(value: string) {
  return value.split(",").map((item) => item.trim());
}

function normalizeWebsite(value: string) {
  return value.startsWith("http") ? value : `https://${value}`;
}

const rawTools = [
  [1, "ChatGPT", "AI Assistant", "chatgpt.com", "https://chatgpt.com/favicon.ico", "Yes", "20", "General AI assistant", "Writing, Coding, Research"],
  [2, "Claude", "AI Assistant", "claude.ai", "https://claude.ai/favicon.ico", "Yes", "20", "Long-context AI", "Documents, Coding"],
  [3, "Gemini", "AI Assistant", "gemini.google.com", "https://gemini.google.com/favicon.ico", "Yes", "20", "Google's multimodal AI", "Search, Productivity"],
  [4, "Perplexity", "AI Search", "perplexity.ai", "https://www.perplexity.ai/favicon.ico", "Yes", "20", "AI search engine", "Research, Citations"],
  [5, "Grok", "AI Assistant", "grok.com", "https://grok.com/favicon.ico", "Yes", "30", "Real-time AI assistant", "Research, Analysis"],
  [6, "Microsoft Copilot", "Productivity AI", "copilot.microsoft.com", "https://copilot.microsoft.com/favicon.ico", "Yes", "20", "Microsoft AI assistant", "Office, Meetings"],
  [7, "Cursor", "Coding AI", "cursor.com", "https://cursor.com/favicon.ico", "Yes", "20", "AI-native IDE", "Software Development"],
  [8, "GitHub Copilot", "Coding AI", "github.com", "https://github.com/favicon.ico", "No", "10", "Coding assistant", "Code Completion"],
  [9, "Claude Code", "Coding AI", "claude.ai", "https://claude.ai/favicon.ico", "No", "20", "Agentic coding", "Large Codebases"],
  [10, "OpenAI Codex", "Coding AI", "openai.com", "https://openai.com/favicon.ico", "No", "Usage", "Autonomous coding", "Development"],
  [11, "Replit AI", "Coding AI", "replit.com", "https://replit.com/favicon.ico", "Yes", "20", "Cloud AI IDE", "App Development"],
  [12, "Cline", "Coding AI", "cline.bot", "https://cline.bot/favicon.ico", "Yes", "0", "Open-source coding agent", "VS Code Automation"],
  [13, "Windsurf", "Coding AI", "windsurf.com", "https://windsurf.com/favicon.ico", "Yes", "15", "Agentic IDE", "Full Stack Development"],
  [14, "Devin", "AI Engineer", "devin.ai", "https://devin.ai/favicon.ico", "No", "500", "Autonomous AI engineer", "End-to-end Development"],
  [15, "Midjourney", "Image AI", "midjourney.com", "https://www.midjourney.com/favicon.ico", "No", "10", "AI art generator", "Design, Marketing"],
  [16, "Stable Diffusion", "Image AI", "stability.ai", "https://stability.ai/favicon.ico", "Yes", "0", "Open-source image model", "Image Generation"],
  [17, "Leonardo AI", "Image AI", "leonardo.ai", "https://leonardo.ai/favicon.ico", "Yes", "12", "Design generation platform", "Assets, Marketing"],
  [18, "Adobe Firefly", "Image AI", "firefly.adobe.com", "https://firefly.adobe.com/favicon.ico", "Limited", "10", "Adobe generative AI", "Creative Design"],
  [19, "Canva AI", "Design AI", "canva.com", "https://www.canva.com/favicon.ico", "Yes", "15", "AI design suite", "Social Media"],
  [20, "Ideogram", "Image AI", "ideogram.ai", "https://ideogram.ai/favicon.ico", "Yes", "8", "Text-focused image AI", "Posters, Ads"],
  [21, "Runway", "Video AI", "runwayml.com", "https://runwayml.com/favicon.ico", "Limited", "15", "AI video creation", "Marketing Videos"],
  [22, "Sora", "Video AI", "openai.com/sora", "https://openai.com/favicon.ico", "No", "Included", "OpenAI video generation", "Cinematic Content"],
  [23, "Pika", "Video AI", "pika.art", "https://pika.art/favicon.ico", "Yes", "10", "Quick video generation", "Social Content"],
  [24, "Synthesia", "Avatar Video AI", "synthesia.io", "https://www.synthesia.io/favicon.ico", "No", "29", "AI avatar videos", "Training Content"],
  [25, "HeyGen", "Avatar Video AI", "heygen.com", "https://www.heygen.com/favicon.ico", "Limited", "29", "AI spokesperson videos", "Marketing"],
  [26, "Veo", "Video AI", "deepmind.google", "https://deepmind.google/favicon.ico", "No", "Usage", "Google's video model", "Filmmaking"],
  [27, "ElevenLabs", "Voice AI", "elevenlabs.io", "https://elevenlabs.io/favicon.ico", "Yes", "5", "Voice synthesis", "Narration"],
  [28, "Suno", "Music AI", "suno.com", "https://suno.com/favicon.ico", "Yes", "10", "AI music generation", "Songs, Jingles"],
  [29, "Udio", "Music AI", "udio.com", "https://udio.com/favicon.ico", "Yes", "10", "AI song creation", "Music Production"],
  [30, "Descript", "Audio AI", "descript.com", "https://www.descript.com/favicon.ico", "Yes", "12", "AI editing platform", "Podcasts"],
  [31, "Otter AI", "Meeting AI", "otter.ai", "https://otter.ai/favicon.ico", "Yes", "17", "Meeting transcription", "Notes, Summaries"],
  [32, "NotebookLM", "Research AI", "notebooklm.google.com", "https://notebooklm.google.com/favicon.ico", "Yes", "0", "AI research notebook", "Knowledge Management"],
  [33, "Notion AI", "Productivity AI", "notion.so", "https://www.notion.so/favicon.ico", "Limited", "10", "Workspace AI", "Documentation"],
  [34, "Grammarly", "Writing AI", "grammarly.com", "https://www.grammarly.com/favicon.ico", "Yes", "12", "Writing assistant", "Editing"],
  [35, "Jasper", "Marketing AI", "jasper.ai", "https://www.jasper.ai/favicon.ico", "No", "39", "Content marketing AI", "Blogs, Ads"],
  [36, "Copy.ai", "Marketing AI", "copy.ai", "https://www.copy.ai/favicon.ico", "Yes", "36", "Sales copy generation", "Marketing"],
  [37, "Tome", "Presentation AI", "tome.app", "https://tome.app/favicon.ico", "Yes", "16", "AI storytelling decks", "Presentations"],
  [38, "Gamma", "Presentation AI", "gamma.app", "https://gamma.app/favicon.ico", "Yes", "10", "AI slide generation", "Reports"],
  [39, "n8n", "Automation AI", "n8n.io", "https://n8n.io/favicon.ico", "Yes", "20", "Workflow automation", "AI Pipelines"],
  [40, "Zapier AI", "Automation AI", "zapier.com", "https://zapier.com/favicon.ico", "Limited", "20", "Automation platform", "Integrations"],
  [41, "Make", "Automation AI", "make.com", "https://www.make.com/favicon.ico", "Yes", "9", "No-code automation", "Workflows"],
  [42, "Lindy", "AI Agent", "lindy.ai", "https://lindy.ai/favicon.ico", "Yes", "29", "Personal AI assistant", "Scheduling"],
  [43, "Gumloop", "AI Agent", "gumloop.com", "https://gumloop.com/favicon.ico", "Yes", "29", "Workflow AI agents", "Business Processes"],
  [44, "Manus", "AI Agent", "manus.im", "https://manus.im/favicon.ico", "Limited", "39", "Autonomous task agent", "Operations"],
  [45, "CrewAI", "Agent Framework", "crewai.com", "https://crewai.com/favicon.ico", "Yes", "0", "Multi-agent orchestration", "Enterprise Agents"],
  [46, "LangChain", "AI Framework", "langchain.com", "https://www.langchain.com/favicon.ico", "Yes", "0", "LLM application framework", "AI Apps"],
  [47, "LlamaIndex", "RAG Framework", "llamaindex.ai", "https://www.llamaindex.ai/favicon.ico", "Yes", "0", "Knowledge retrieval framework", "RAG Systems"],
  [48, "Vertex AI", "Enterprise AI", "cloud.google.com/vertex-ai", "https://cloud.google.com/favicon.ico", "No", "Usage", "Google AI platform", "Model Deployment"],
  [49, "Azure AI Foundry", "Enterprise AI", "azure.microsoft.com", "https://azure.microsoft.com/favicon.ico", "No", "Usage", "Microsoft AI platform", "Enterprise AI"],
  [50, "Amazon Bedrock", "Enterprise AI", "aws.amazon.com/bedrock", "https://aws.amazon.com/favicon.ico", "No", "Usage", "AWS foundation model platform", "AI Infrastructure"],
] as const;

export const tools: Tool[] = rawTools.map((entry, index) => {
  const [id, name, category, website, faviconUrl, free, startingPrice, description, useCases] =
    entry;

  return {
    id,
    slug: slugify(name),
    name,
    tagline: description,
    category,
    categorySlug: slugify(category),
    website: normalizeWebsite(website),
    faviconUrl,
    free: free as ToolPricing,
    startingPrice,
    description,
    useCases: parseUseCases(useCases),
    badge:
      index < 6
        ? "Featured"
        : category === "Coding AI"
          ? "Builder Pick"
          : category === "Video AI"
            ? "Creative"
            : undefined,
    sponsored: name === "Microsoft Copilot" || name === "Zapier AI",
  };
});

const categoryDescriptions: Record<string, string> = {
  "ai-assistant": "General-purpose assistants for writing, coding, reasoning, and productivity.",
  "ai-search": "Search-oriented AI tools focused on research and cited answers.",
  "productivity-ai": "Workplace AI tools for docs, planning, office workflows, and meetings.",
  "coding-ai": "Development tools for code generation, AI IDE workflows, and software delivery.",
  "ai-engineer": "Autonomous coding systems designed for broader engineering tasks.",
  "image-ai": "Image generation tools for assets, design, art, and campaign visuals.",
  "design-ai": "AI-assisted design products for social, brand, and creative work.",
  "video-ai": "Video generation platforms for social content, creative media, and marketing.",
  "avatar-video-ai": "Avatar and spokesperson video tools for training and brand communication.",
  "voice-ai": "Voice synthesis tools for narration, dubbing, and spoken content.",
  "music-ai": "AI music platforms for songs, jingles, and audio ideation.",
  "audio-ai": "Audio-first AI products for editing and production workflows.",
  "meeting-ai": "Meeting assistants for notes, summaries, and transcripts.",
  "research-ai": "Research tools for knowledge capture, synthesis, and exploration.",
  "writing-ai": "Writing assistants focused on editing, grammar, and drafting quality.",
  "marketing-ai": "Growth and copywriting tools for ads, blogs, and campaigns.",
  "presentation-ai": "Slide and storytelling tools for decks, reports, and presentations.",
  "automation-ai": "Automation platforms for workflows, integrations, and AI pipelines.",
  "ai-agent": "Agentic tools for autonomous task execution and operations.",
  "agent-framework": "Frameworks for orchestrating multiple autonomous agents.",
  "ai-framework": "Core frameworks for building AI applications and agent systems.",
  "rag-framework": "Retrieval and knowledge frameworks for RAG systems and search layers.",
  "enterprise-ai": "Enterprise platforms for deploying, operating, and scaling AI systems.",
};

export const categories: Category[] = Array.from(
  tools.reduce((map, tool) => {
    const current = map.get(tool.categorySlug);

    if (current) {
      current.count += 1;
      return map;
    }

    map.set(tool.categorySlug, {
      name: tool.category,
      slug: tool.categorySlug,
      count: 1,
      description:
        categoryDescriptions[tool.categorySlug] ||
        `${tool.category} tools curated for practical business use cases.`,
    });

    return map;
  }, new Map<string, Category>()),
).map(([, category]) => category);

export const reviews: Record<string, Review[]> = {
  chatgpt: [
    {
      author: "Mia Patel",
      role: "Growth Lead",
      rating: 5,
      comment: "A strong all-rounder when the team needs one assistant across writing, coding, and rapid research tasks.",
    },
  ],
  claude: [
    {
      author: "Jordan Lee",
      role: "Research Manager",
      rating: 5,
      comment: "Especially useful for document-heavy work and long-context reasoning across research and policy tasks.",
    },
  ],
  cursor: [
    {
      author: "Chris Kim",
      role: "Engineering Lead",
      rating: 4,
      comment: "A practical AI-native IDE for teams that want a stronger coding workflow than simple autocomplete alone.",
    },
  ],
};

export const comparisons: Comparison[] = [
  {
    slug: "chatgpt-vs-claude",
    title: "ChatGPT vs Claude",
    summary: "Compare two leading AI assistants across core workflows, use cases, and starting plans.",
  },
  {
    slug: "cursor-vs-github-copilot",
    title: "Cursor vs GitHub Copilot",
    summary: "A direct comparison for teams evaluating AI coding tools and day-to-day developer workflows.",
  },
  {
    slug: "midjourney-vs-adobe-firefly",
    title: "Midjourney vs Adobe Firefly",
    summary: "Creative image tools compared across design-heavy and marketing-ready workflows.",
  },
  {
    slug: "runway-vs-synthesia",
    title: "Runway vs Synthesia",
    summary: "Video generation versus avatar-first production for marketing and business teams.",
  },
];

export const monetizationPages = [
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/advertising-disclosure", label: "Advertising Disclosure" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/dmca", label: "DMCA Policy" },
];

export const finderQuestions = [
  "Do you need an assistant?",
  "Are you building software?",
  "Do you need image or video creation?",
  "Are you automating workflows?",
  "Do you need enterprise deployment?",
  "Are you researching or summarizing content?",
];

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getToolsByCategory(slug: string) {
  return tools.filter((tool) => tool.categorySlug === slug);
}

export function getComparisonBySlug(slug: string) {
  return comparisons.find((comparison) => comparison.slug === slug);
}

export function getComparisonTools(slug: string) {
  const [leftSlug, rightSlug] = slug.split("-vs-");
  const left = getToolBySlug(leftSlug);
  const right = getToolBySlug(rightSlug);

  if (!left || !right) {
    return null;
  }

  return { left, right };
}
