export type TrendingProjectCategory =
  | "AI Agents"
  | "LLMs"
  | "RAG"
  | "Vision"
  | "Voice"
  | "Tools"
  | "Data"
  | "Generative AI"
  | "ML"
  | "Infrastructure";

export type TrendingProject = {
  rank: number;
  name: string;
  fullName: string;
  owner: string;
  description: string;
  url: string;
  avatarUrl: string | null;
  logoUrl: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  categories: TrendingProjectCategory[];
  trendScore: number;
  lastUpdated: string;
  pushedAt: string | null;
  createdAt: string;
};

export type TrendingProjectsCache = {
  updatedAt: string;
  projects: TrendingProject[];
};

export type TrendingProjectsResponse = TrendingProjectsCache & {
  isStale: boolean;
  isRefreshing?: boolean;
  message?: string;
};

export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url?: string;
  };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  pushed_at: string | null;
  created_at: string;
  archived: boolean;
  disabled: boolean;
  fork: boolean;
};
