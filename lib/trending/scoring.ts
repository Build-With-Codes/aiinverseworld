import type { GitHubRepository, TrendingProjectCategory } from "@/lib/trending/types";

const DAY_MS = 24 * 60 * 60 * 1000;

export const trendWeights = {
  stars: 26,
  forks: 14,
  commitActivity: 28,
  repoFreshness: 14,
  topicRelevance: 18,
};

const categoryMatchers: Array<{
  category: TrendingProjectCategory;
  terms: string[];
}> = [
  { category: "AI Agents", terms: ["agent", "agents", "autonomous", "workflow"] },
  { category: "LLMs", terms: ["llm", "large-language-model", "language-model", "gpt", "transformer"] },
  { category: "RAG", terms: ["rag", "retrieval", "vector", "embedding", "llamaindex"] },
  { category: "Vision", terms: ["vision", "image", "computer-vision", "diffusion", "stable-diffusion"] },
  { category: "Voice", terms: ["voice", "speech", "audio", "tts", "stt", "whisper"] },
  { category: "Tools", terms: ["developer-tools", "ai-tools", "copilot", "automation", "cli"] },
  { category: "Data", terms: ["data", "dataset", "evaluation", "eval", "benchmark"] },
  { category: "Generative AI", terms: ["generative-ai", "generation", "diffusion", "text-to-image"] },
  { category: "ML", terms: ["machine-learning", "ml", "deep-learning", "neural-network"] },
  { category: "Infrastructure", terms: ["inference", "serving", "deployment", "local-ai", "gpu"] },
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function logScore(value: number, highWatermark: number) {
  if (value <= 0) return 0;
  return clamp(Math.log10(value + 1) / Math.log10(highWatermark + 1));
}

function recencyScore(date: string | null, windowDays: number) {
  if (!date) return 0;
  const timestamp = new Date(date).getTime();
  if (Number.isNaN(timestamp)) return 0;
  const ageDays = (Date.now() - timestamp) / DAY_MS;
  return clamp(1 - ageDays / windowDays);
}

export function classifyProject(repo: Pick<GitHubRepository, "name" | "description" | "topics" | "language">) {
  const haystack = [
    repo.name,
    repo.description ?? "",
    repo.language ?? "",
    ...(repo.topics ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const categories = categoryMatchers
    .filter(({ terms }) => terms.some((term) => haystack.includes(term)))
    .map(({ category }) => category);

  return categories.length ? categories.slice(0, 3) : (["Tools"] satisfies TrendingProjectCategory[]);
}

export function scoreRepository(repo: GitHubRepository) {
  const topics = repo.topics ?? [];
  const categories = classifyProject(repo);
  const topicRelevance =
    categories.length / 3 +
    (topics.some((topic) => ["ai", "artificial-intelligence", "generative-ai"].includes(topic)) ? 0.35 : 0);

  const score =
    logScore(repo.stargazers_count, 150_000) * trendWeights.stars +
    logScore(repo.forks_count, 30_000) * trendWeights.forks +
    recencyScore(repo.pushed_at ?? repo.updated_at, 90) * trendWeights.commitActivity +
    recencyScore(repo.created_at, 730) * trendWeights.repoFreshness +
    clamp(topicRelevance) * trendWeights.topicRelevance;

  return Number(score.toFixed(2));
}
