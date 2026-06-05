export type PricingTier = "Free" | "Freemium" | "Paid" | "Enterprise";

export type Review = {
  author: string;
  role: string;
  rating: number;
  comment: string;
};

export type Tool = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categorySlug: string;
  pricing: PricingTier;
  rating: number;
  reviewsCount: number;
  platform: string[];
  tags: string[];
  description: string;
  features: string[];
  useCases: string[];
  pros: string[];
  cons: string[];
  website: string;
  monthlyVisits: string;
  founded: string;
  screenshots: string[];
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

export const categories: Category[] = [
  {
    name: "Writing",
    slug: "writing",
    count: 142,
    description: "Draft blogs, ad copy, social posts, and long-form documents.",
  },
  {
    name: "Image Generation",
    slug: "image-generation",
    count: 88,
    description: "Create campaigns, concept art, and branded visuals faster.",
  },
  {
    name: "Video",
    slug: "video",
    count: 61,
    description: "Turn ideas into explainers, reels, demos, and product stories.",
  },
  {
    name: "Developer Tools",
    slug: "developer-tools",
    count: 96,
    description: "Ship code, test apps, and automate workflows with AI copilots.",
  },
  {
    name: "Productivity",
    slug: "productivity",
    count: 109,
    description: "Summarize meetings, manage tasks, and keep work moving.",
  },
  {
    name: "Research",
    slug: "research",
    count: 54,
    description: "Analyze papers, gather citations, and answer deeper questions.",
  },
];

export const tools: Tool[] = [
  {
    id: 1,
    slug: "nova-write",
    name: "NovaWrite",
    tagline: "Enterprise-ready AI writing assistant for marketing teams",
    category: "Writing",
    categorySlug: "writing",
    pricing: "Freemium",
    rating: 4.8,
    reviewsCount: 281,
    platform: ["Web", "Chrome", "API"],
    tags: ["SEO", "Marketing", "Blogs"],
    description:
      "NovaWrite helps content teams generate, optimize, and repurpose high-performing copy with brand-safe workflows.",
    features: [
      "Brand voice presets",
      "SEO briefs and outlines",
      "Approval workflows",
      "Multi-language generation",
    ],
    useCases: [
      "Content marketing",
      "Landing page copy",
      "Email campaigns",
      "Thought leadership drafts",
    ],
    pros: [
      "Fast editorial workflows",
      "Strong collaboration features",
      "Reliable tone consistency",
    ],
    cons: [
      "Needs setup for niche industries",
      "Advanced templates gated on higher plans",
    ],
    website: "https://example.com/novawrite",
    monthlyVisits: "1.2M",
    founded: "2023",
    screenshots: ["/grid.svg", "/window.svg"],
    badge: "Trending",
  },
  {
    id: 2,
    slug: "pixelmint",
    name: "PixelMint",
    tagline: "Creative AI image studio for campaigns and product launches",
    category: "Image Generation",
    categorySlug: "image-generation",
    pricing: "Paid",
    rating: 4.7,
    reviewsCount: 198,
    platform: ["Web", "iOS"],
    tags: ["Design", "Branding", "Ads"],
    description:
      "PixelMint produces campaign visuals, mockups, and art direction boards with enterprise controls.",
    features: [
      "Campaign style kits",
      "Background replacement",
      "Prompt history",
      "Team asset library",
    ],
    useCases: [
      "Ad creative generation",
      "Product hero imagery",
      "Moodboards",
      "Social media design",
    ],
    pros: [
      "Excellent output consistency",
      "Strong brand control tools",
      "Fast ideation cycles",
    ],
    cons: [
      "No public API yet",
      "Higher credit costs for 4K renders",
    ],
    website: "https://example.com/pixelmint",
    monthlyVisits: "842K",
    founded: "2022",
    screenshots: ["/globe.svg", "/file.svg"],
    badge: "Top Rated",
    sponsored: true,
  },
  {
    id: 3,
    slug: "forgeflow",
    name: "ForgeFlow",
    tagline: "AI developer copilot for debugging, tests, and code generation",
    category: "Developer Tools",
    categorySlug: "developer-tools",
    pricing: "Enterprise",
    rating: 4.9,
    reviewsCount: 356,
    platform: ["VS Code", "JetBrains", "API"],
    tags: ["Coding", "QA", "Automation"],
    description:
      "ForgeFlow accelerates engineering teams with code suggestions, test scaffolds, and repo-aware assistance.",
    features: [
      "Repo context indexing",
      "Test generation",
      "PR summaries",
      "Security checks",
    ],
    useCases: [
      "Bug fixing",
      "Refactoring support",
      "Release QA",
      "Onboarding engineers",
    ],
    pros: [
      "Strong codebase awareness",
      "Good team analytics",
      "Useful guardrails for enterprise",
    ],
    cons: [
      "Premium pricing",
      "Needs admin rollout for best results",
    ],
    website: "https://example.com/forgeflow",
    monthlyVisits: "2.1M",
    founded: "2021",
    screenshots: ["/next.svg", "/vercel.svg"],
    badge: "Editors' Pick",
  },
  {
    id: 4,
    slug: "studybeam",
    name: "StudyBeam",
    tagline: "AI tutor for notes, quizzes, and adaptive study plans",
    category: "Research",
    categorySlug: "research",
    pricing: "Free",
    rating: 4.6,
    reviewsCount: 143,
    platform: ["Web", "Android", "iOS"],
    tags: ["Education", "Notes", "Quizzes"],
    description:
      "StudyBeam turns uploaded notes and lectures into flashcards, quizzes, and personalized learning paths.",
    features: [
      "Lecture summarization",
      "Quiz generation",
      "Study streaks",
      "Progress insights",
    ],
    useCases: [
      "Exam prep",
      "Revision planning",
      "Concept explanation",
      "Homework support",
    ],
    pros: [
      "Easy to use on mobile",
      "Helpful quiz engine",
      "Great for students",
    ],
    cons: [
      "Limited collaboration tools",
      "Best features require uploads",
    ],
    website: "https://example.com/studybeam",
    monthlyVisits: "563K",
    founded: "2024",
    screenshots: ["/window.svg", "/globe.svg"],
    badge: "Free",
  },
  {
    id: 5,
    slug: "clippilot",
    name: "ClipPilot",
    tagline: "Video creation AI for explainers, shorts, and product demos",
    category: "Video",
    categorySlug: "video",
    pricing: "Freemium",
    rating: 4.5,
    reviewsCount: 119,
    platform: ["Web", "API"],
    tags: ["Video", "Social", "Editing"],
    description:
      "ClipPilot transforms scripts into edited videos with voiceovers, subtitles, and platform-ready exports.",
    features: [
      "Auto storyboard",
      "AI voiceovers",
      "Subtitle styling",
      "One-click format resize",
    ],
    useCases: [
      "Product demos",
      "Short-form content",
      "Training videos",
      "Ad testing",
    ],
    pros: [
      "Fast rendering",
      "Strong social output formats",
      "Clear onboarding",
    ],
    cons: [
      "Template library still growing",
      "Best voices are premium",
    ],
    website: "https://example.com/clippilot",
    monthlyVisits: "436K",
    founded: "2022",
    screenshots: ["/file.svg", "/grid.svg"],
  },
  {
    id: 6,
    slug: "opsmind",
    name: "OpsMind",
    tagline: "AI workspace for meeting notes, planning, and team execution",
    category: "Productivity",
    categorySlug: "productivity",
    pricing: "Paid",
    rating: 4.7,
    reviewsCount: 205,
    platform: ["Web", "Slack", "Notion"],
    tags: ["Meetings", "Tasks", "Teams"],
    description:
      "OpsMind captures conversations, generates action items, and keeps projects aligned across tools.",
    features: [
      "Meeting transcription",
      "Action-item sync",
      "Project status digests",
      "Slack summaries",
    ],
    useCases: [
      "Weekly planning",
      "Cross-functional syncs",
      "Manager updates",
      "Operations review",
    ],
    pros: [
      "Excellent workflow automation",
      "Useful cross-tool summaries",
      "Strong enterprise positioning",
    ],
    cons: [
      "Requires workspace integrations",
      "Smaller free trial",
    ],
    website: "https://example.com/opsmind",
    monthlyVisits: "918K",
    founded: "2023",
    screenshots: ["/next.svg", "/window.svg"],
  },
];

export const reviews: Record<string, Review[]> = {
  "nova-write": [
    {
      author: "Mia Patel",
      role: "Content Lead",
      rating: 5,
      comment: "The workflow feels built for real editorial teams, not just solo writers.",
    },
    {
      author: "Jordan Lee",
      role: "Growth Marketer",
      rating: 4,
      comment: "The SEO workflows save us hours every week.",
    },
  ],
  forgeflow: [
    {
      author: "Chris Kim",
      role: "VP Engineering",
      rating: 5,
      comment: "The best repo-aware assistant we tested for larger teams.",
    },
  ],
};

export const comparisons: Comparison[] = [
  {
    slug: "forgeflow-vs-nova-write",
    title: "ForgeFlow vs NovaWrite",
    summary: "Developer copilot versus content engine for teams with mixed AI workflows.",
  },
  {
    slug: "pixelmint-vs-clippilot",
    title: "PixelMint vs ClipPilot",
    summary: "Creative image generation compared with AI video production.",
  },
  {
    slug: "opsmind-vs-studybeam",
    title: "OpsMind vs StudyBeam",
    summary: "Team productivity assistant versus personalized learning companion.",
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
  "What do you want to do?",
  "Generate images?",
  "Build apps?",
  "Create videos?",
  "Write content?",
  "Study smarter?",
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
