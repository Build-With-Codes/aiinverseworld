export type RawNewsArticle = {
  title: string;
  url: string;
  sourceName: string;
  excerpt?: string;
  summary?: string;
  category?: string;
  imageUrl?: string | null;
  publishedAt?: string | null;
};

export const newsSources = [
  {
    name: "OpenAI",
    category: "Models & LLMs",
    rssUrl: "https://openai.com/news/rss.xml",
  },
  {
    name: "Anthropic",
    category: "Models & LLMs",
    rssUrl: "https://www.anthropic.com/news/rss.xml",
  },
  {
    name: "Google AI",
    category: "AI Research",
    rssUrl: "https://blog.google/technology/ai/rss/",
  },
  {
    name: "Hugging Face",
    category: "Open Source",
    rssUrl: "https://huggingface.co/blog/feed.xml",
  },
  {
    name: "NVIDIA",
    category: "Infrastructure",
    rssUrl: "https://blogs.nvidia.com/feed/",
  },
  {
    name: "TechCrunch AI",
    category: "Startups",
    rssUrl: "https://techcrunch.com/category/artificial-intelligence/feed/",
  },
  {
    name: "VentureBeat AI",
    category: "AI Tools",
    rssUrl: "https://venturebeat.com/category/ai/feed/",
  },
  {
    name: "The Verge AI",
    category: "AI Tools",
    rssUrl: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
  },
  {
    name: "MIT News AI",
    category: "AI Research",
    rssUrl: "https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml",
  },
  {
    name: "Microsoft AI",
    category: "Models & LLMs",
    rssUrl: "https://blogs.microsoft.com/ai/feed/",
  },
] as const;
