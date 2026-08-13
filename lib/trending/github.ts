import { classifyProject, scoreRepository } from "@/lib/trending/scoring";
import type { GitHubRepository, TrendingProject } from "@/lib/trending/types";

const GITHUB_SEARCH_URL = "https://api.github.com/search/repositories";

const candidateQueries = [
  "topic:artificial-intelligence stars:>50 pushed:>2025-01-01 archived:false",
  "topic:generative-ai stars:>50 pushed:>2025-01-01 archived:false",
  "topic:llm stars:>50 pushed:>2025-01-01 archived:false",
  "topic:ai-agent stars:>20 pushed:>2025-01-01 archived:false",
  "topic:rag stars:>20 pushed:>2025-01-01 archived:false",
  "topic:computer-vision stars:>50 pushed:>2025-01-01 archived:false",
  "topic:speech-recognition stars:>20 pushed:>2025-01-01 archived:false",
  "topic:machine-learning stars:>100 pushed:>2025-01-01 archived:false",
];

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN?.trim();
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "AiverseWorld-Trending-Projects",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function searchRepositories(query: string) {
  const url = new URL(GITHUB_SEARCH_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("sort", "updated");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", "60");

  const response = await fetch(url.toString(), {
    headers: githubHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GitHub search failed (${response.status}): ${detail.slice(0, 220)}`);
  }

  const payload = (await response.json()) as { items?: GitHubRepository[] };
  return payload.items ?? [];
}

function normalizeRepo(repo: GitHubRepository, rank: number): TrendingProject {
  const topics = (repo.topics ?? []).slice(0, 8);
  return {
    rank,
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
    description: repo.description ?? "Open-source AI project on GitHub.",
    url: repo.html_url,
    avatarUrl: repo.owner.avatar_url ?? null,
    logoUrl: null,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics,
    categories: classifyProject(repo),
    trendScore: scoreRepository(repo),
    lastUpdated: repo.updated_at,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
  };
}

export async function fetchTrendingProjectsFromGitHub() {
  const seen = new Map<number, GitHubRepository>();

  for (const query of candidateQueries) {
    const repos = await searchRepositories(query);
    for (const repo of repos) {
      if (repo.archived || repo.disabled || repo.fork) continue;
      seen.set(repo.id, repo);
      if (seen.size >= 500) break;
    }
    if (seen.size >= 500) break;
  }

  return Array.from(seen.values())
    .map((repo) => ({ repo, score: scoreRepository(repo) }))
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return right.repo.stargazers_count - left.repo.stargazers_count;
    })
    .slice(0, 100)
    .map(({ repo }, index) => normalizeRepo(repo, index + 1));
}
