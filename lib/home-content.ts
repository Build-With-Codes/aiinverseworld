export const aiFinderOptions = [
  {
    title: "Growth teams",
    description: "Find writing, SEO, image, and analytics tools in one flow.",
    query: "Recommend AI tools for growth teams doing writing SEO images and analytics",
    icon: "growth" as const,
    accent: "from-cyan-400/16 via-sky-500/10 to-transparent",
    iconClass: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  },
  {
    title: "Builders",
    description: "Compare copilots, agents, code search, and automation stacks.",
    query: "Recommend AI tools for builders using copilots agents code search and automation",
    icon: "builders" as const,
    accent: "from-violet-400/16 via-indigo-500/10 to-transparent",
    iconClass: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  },
  {
    title: "Creators",
    description: "Explore tools for visuals, video, voice, and campaign production.",
    query: "Recommend AI tools for creators making visuals video voice and campaigns",
    icon: "creators" as const,
    accent: "from-amber-400/16 via-rose-500/10 to-transparent",
    iconClass: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
];

export const finderQuestions = [
  {
    label: "Do you need an assistant?",
    query: "Recommend an AI assistant for everyday work productivity and answers",
  },
  {
    label: "Are you building software?",
    query: "Recommend AI tools for building software coding debugging and agents",
  },
  {
    label: "Do you need image or video creation?",
    query: "Recommend AI tools for image generation video creation and design",
  },
  {
    label: "Are you automating workflows?",
    query: "Recommend AI tools for workflow automation integrations and operations",
  },
  {
    label: "Do you need enterprise deployment?",
    query: "Recommend enterprise AI tools for secure deployment governance and teams",
  },
  {
    label: "Are you researching or summarizing content?",
    query: "Recommend AI tools for research summarizing PDFs documents and knowledge",
  },
];

export const homeRecommendationQuery = "research summarize PDFs knowledge documents";
