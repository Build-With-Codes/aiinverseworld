import { promises as fs } from "node:fs";
import path from "node:path";
import { AIVERSE_WORLD_BASE_URL } from "@/lib/service-urls";

export type ProblemAnalysis = {
  whoHasThisProblem: string;
  severity: string;
  softwareFit: string;
  aiFit: string;
  marketOpportunity: string;
  opportunityScore: number;
  startupIdeas: string[];
};

export type StoredProblem = {
  id: string;
  title: string;
  description: string;
  industry: string;
  frequency: string;
  painScore: number;
  email?: string;
  createdAt: string;
  analysis: ProblemAnalysis;
  votes: ProblemVotes;
};

export type ProblemVotes = {
  aiSolvable: number;
  notAiSolvable: number;
};

export type ProblemVote = keyof ProblemVotes;

export type ProblemVoteSummary = ProblemVotes & {
  total: number;
  aiScore: number;
};

export type ProblemSort = "newest" | "oldest" | "pain" | "ai-score";

export type ProblemListOptions = {
  page?: number;
  limit?: number;
  industry?: string;
  search?: string;
  sort?: ProblemSort;
};

export type ProblemListResult = {
  problems: StoredProblem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    industries: string[];
  };
};

type CreateProblemInput = {
  title: string;
  description: string;
  industry: string;
  frequency: string;
  painScore: number;
  email?: string;
};

type BackendProblem = Omit<StoredProblem, "analysis"> & {
  updatedAt?: string;
  voteSummary?: {
    total: number;
    aiScore: number;
  };
};

type BackendProblemListResponse = {
  data?: BackendProblem[];
  pagination?: ProblemListResult["pagination"];
  filters?: ProblemListResult["filters"];
};

type BackendProblemResponse = {
  data?: BackendProblem;
};

const dataDirectory = path.join(process.cwd(), "data");
const problemsFile = path.join(dataDirectory, "problems.json");


function buildFallbackAnalysis(input: CreateProblemInput): ProblemAnalysis {
  return {
    whoHasThisProblem: `Companies in ${input.industry} and adjacent service-heavy industries likely face this issue, especially teams handling the same workflow repeatedly.`,
    severity: `A pain score of ${input.painScore}/10 suggests this is a meaningful operational issue that costs time, money, or focus on a ${input.frequency.toLowerCase()} basis.`,
    softwareFit:
      "Yes. The problem sounds structured enough for workflow software, automation, tracking, and team coordination.",
    aiFit:
      "AI could likely help with triage, recommendations, prediction, summarization, or automating repetitive decisions inside the workflow.",
    marketOpportunity:
      "This looks promising if many teams share the same repeated pain and are willing to pay for time savings, better outcomes, or lower error rates.",
    opportunityScore: Math.max(55, Math.min(98, input.painScore * 10)),
    startupIdeas: [
      `Vertical SaaS for ${input.industry.toLowerCase()} workflow automation`,
      `AI copilot for reducing ${input.title.toLowerCase()}`,
      `Team dashboard for tracking and fixing this recurring problem`,
    ],
  };
}

function resolveOpenRouterChatUrl() {
  const configuredUrl = process.env.OPENROUTER_BASE_URL?.trim();

  if (!configuredUrl) {
    return "https://openrouter.ai/api/v1/chat/completions";
  }

  if (configuredUrl.endsWith("/chat/completions")) {
    return configuredUrl;
  }

  if (configuredUrl.endsWith("/api/v1")) {
    return `${configuredUrl}/chat/completions`;
  }

  if (configuredUrl.endsWith("/api/v1/")) {
    return `${configuredUrl}chat/completions`;
  }

  const normalizedBase = configuredUrl.replace(/\/+$/, "");

  if (normalizedBase.endsWith("/api")) {
    return `${normalizedBase}/v1/chat/completions`;
  }

  return `${normalizedBase}/api/v1/chat/completions`;
}

function getOpenRouterModels() {
  const configuredModel = process.env.OPENROUTER_MODEL?.trim();
  const fallbackModels = [
    "~google/gemini-flash-latest",
    "google/gemini-3.1-flash-lite",
    "google/gemini-3.5-flash",
  ];

  return Array.from(
    new Set(
      [configuredModel, ...fallbackModels].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  );
}

async function ensureStore() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(problemsFile);
  } catch {
  //  await fs.writeFile(problemsFile, JSON.stringify(seedProblems, null, 2), "utf8");
  }
}

async function readAllProblems() {
  await ensureStore();
  const raw = await fs.readFile(problemsFile, "utf8");
  const problems = JSON.parse(raw) as Array<StoredProblem & { votes?: Partial<ProblemVotes> }>;

  return problems.map((problem) => ({
    ...problem,
    votes: normalizeProblemVotes(problem.votes),
  }));
}

async function writeAllProblems(problems: StoredProblem[]) {
  await fs.writeFile(problemsFile, JSON.stringify(problems, null, 2), "utf8");
}

function attachFallbackAnalysis(problem: BackendProblem): StoredProblem {
  return {
    id: problem.id,
    title: problem.title,
    description: problem.description,
    industry: problem.industry,
    frequency: problem.frequency,
    painScore: problem.painScore,
    email: problem.email,
    createdAt: problem.createdAt,
    votes: normalizeProblemVotes(problem.votes),
    analysis: buildFallbackAnalysis({
      title: problem.title,
      description: problem.description,
      industry: problem.industry,
      frequency: problem.frequency,
      painScore: problem.painScore,
      email: problem.email,
    }),
  };
}

function getDefaultProblemListResult(problems: StoredProblem[]): ProblemListResult {
  return {
    problems,
    pagination: {
      page: 1,
      limit: problems.length || 12,
      total: problems.length,
      totalPages: 1,
    },
    filters: {
      industries: Array.from(new Set(problems.map((problem) => problem.industry))).sort(),
    },
  };
}

async function getProblemsFromBackend(
  options: Required<ProblemListOptions>,
): Promise<ProblemListResult | null> {
  const searchParams = new URLSearchParams({
    page: String(options.page),
    limit: String(options.limit),
    sort: options.sort,
  });

  if (options.industry) {
    searchParams.set("industry", options.industry);
  }

  if (options.search) {
    searchParams.set("search", options.search);
  }

  try {
    const response = await fetch(
      `${AIVERSE_WORLD_BASE_URL}/api/problems?${searchParams.toString()}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as BackendProblemListResponse;
    const backendProblems = payload.data ?? [];

    return {
      problems: backendProblems.map(attachFallbackAnalysis),
      pagination: payload.pagination ?? {
        page: options.page,
        limit: options.limit,
        total: backendProblems.length,
        totalPages: 1,
      },
      filters: payload.filters ?? {
        industries: [],
      },
    };
  } catch {
    return null;
  }
}

async function getProblemFromBackend(id: string) {
  try {
    const response = await fetch(`${AIVERSE_WORLD_BASE_URL}/api/problems/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as BackendProblemResponse;
    return payload.data ? attachFallbackAnalysis(payload.data) : null;
  } catch {
    return null;
  }
}

async function generateProblemAnalysis(
  input: CreateProblemInput,
): Promise<ProblemAnalysis> {
  if (!process.env.OPENROUTER_API_KEY) {
    return buildFallbackAnalysis(input);
  }

  const openRouterUrl = resolveOpenRouterChatUrl();

  for (const model of getOpenRouterModels()) {
    try {
      const response = await fetch(openRouterUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "https://aiverseworld.com",
          "X-Title": process.env.OPENROUTER_APP_NAME ?? "AiverseWorld Problems",
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You analyze startup problems. Return JSON only with whoHasThisProblem, severity, softwareFit, aiFit, marketOpportunity, opportunityScore, startupIdeas. Keep each text field concise, factual, and founder-friendly. startupIdeas must be an array of 3 to 5 strings.",
            },
            {
              role: "user",
              content: JSON.stringify({
                title: input.title,
                description: input.description,
                industry: input.industry,
                frequency: input.frequency,
                painScore: input.painScore,
              }),
            },
          ],
        }),
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = payload.choices?.[0]?.message?.content;

      if (!content) {
        continue;
      }

      const parsed = JSON.parse(content) as Partial<ProblemAnalysis>;

      if (
        !parsed.whoHasThisProblem ||
        !parsed.severity ||
        !parsed.softwareFit ||
        !parsed.aiFit ||
        !parsed.marketOpportunity ||
        !Array.isArray(parsed.startupIdeas) ||
        parsed.startupIdeas.length === 0
      ) {
        continue;
      }

      return {
        whoHasThisProblem: parsed.whoHasThisProblem.trim(),
        severity: parsed.severity.trim(),
        softwareFit: parsed.softwareFit.trim(),
        aiFit: parsed.aiFit.trim(),
        marketOpportunity: parsed.marketOpportunity.trim(),
        opportunityScore: Math.max(
          1,
          Math.min(100, Number(parsed.opportunityScore) || input.painScore * 10),
        ),
        startupIdeas: parsed.startupIdeas.map((idea) => idea.trim()).slice(0, 5),
      };
    } catch {
      continue;
    }
  }

  return buildFallbackAnalysis(input);
}

export async function getProblems(options: ProblemListOptions = {}) {
  const normalizedOptions: Required<ProblemListOptions> = {
    page: Math.max(1, Number(options.page) || 1),
    limit: Math.max(1, Math.min(50, Number(options.limit) || 12)),
    industry: options.industry?.trim() ?? "",
    search: options.search?.trim() ?? "",
    sort: options.sort ?? "newest",
  };

  const backendResult = await getProblemsFromBackend(normalizedOptions);

  if (backendResult) {
    return backendResult;
  }

  const allProblems = (await readAllProblems())
    .filter((problem) =>
      normalizedOptions.industry
        ? problem.industry.toLowerCase() === normalizedOptions.industry.toLowerCase()
        : true,
    )
    .filter((problem) => {
      if (!normalizedOptions.search) {
        return true;
      }

      const haystack = `${problem.title} ${problem.description} ${problem.industry}`.toLowerCase();
      return haystack.includes(normalizedOptions.search.toLowerCase());
    })
    .sort((left, right) => {
      if (normalizedOptions.sort === "oldest") {
        return left.createdAt.localeCompare(right.createdAt);
      }

      if (normalizedOptions.sort === "pain") {
        return right.painScore - left.painScore;
      }

      if (normalizedOptions.sort === "ai-score") {
        return getProblemVoteSummary(right).aiScore - getProblemVoteSummary(left).aiScore;
      }

      return right.createdAt.localeCompare(left.createdAt);
    });

  const start = (normalizedOptions.page - 1) * normalizedOptions.limit;
  const problems = allProblems.slice(start, start + normalizedOptions.limit);

  return {
    ...getDefaultProblemListResult(problems),
    pagination: {
      page: normalizedOptions.page,
      limit: normalizedOptions.limit,
      total: allProblems.length,
      totalPages: Math.max(1, Math.ceil(allProblems.length / normalizedOptions.limit)),
    },
    filters: {
      industries: Array.from(
        new Set((await readAllProblems()).map((problem) => problem.industry)),
      ).sort(),
    },
  };
}

export async function getProblemById(id: string) {
  const backendProblem = await getProblemFromBackend(id);

  if (backendProblem) {
    return backendProblem;
  }

  const problems = await readAllProblems();
  return problems.find((problem) => problem.id === id) ?? null;
}

function normalizeProblemVotes(votes?: Partial<ProblemVotes>): ProblemVotes {
  return {
    aiSolvable: Math.max(0, Number(votes?.aiSolvable) || 0),
    notAiSolvable: Math.max(0, Number(votes?.notAiSolvable) || 0),
  };
}

export function getProblemVoteSummary(problem: StoredProblem): ProblemVoteSummary {
  const votes = normalizeProblemVotes(problem.votes);
  const total = votes.aiSolvable + votes.notAiSolvable;

  return {
    ...votes,
    total,
    aiScore: total ? Math.round((votes.aiSolvable / total) * 100) : 0,
  };
}

export async function createProblem(input: CreateProblemInput) {
  try {
    const response = await fetch(`${AIVERSE_WORLD_BASE_URL}/api/problems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (response.ok) {
      const payload = (await response.json()) as BackendProblemResponse;

      if (payload.data) {
        return attachFallbackAnalysis(payload.data);
      }
    }
  } catch {
  }

  const problems = await readAllProblems();
  const analysis = buildFallbackAnalysis(input);

  const nextProblem: StoredProblem = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description.trim(),
    industry: input.industry.trim(),
    frequency: input.frequency.trim(),
    painScore: input.painScore,
    email: input.email?.trim() || undefined,
    createdAt: new Date().toISOString(),
    analysis,
    votes: {
      aiSolvable: 0,
      notAiSolvable: 0,
    },
  };

  problems.unshift(nextProblem);
  await writeAllProblems(problems);

  return nextProblem;
}

export async function voteOnProblem(id: string, vote: ProblemVote) {
  try {
    const response = await fetch(`${AIVERSE_WORLD_BASE_URL}/api/problems/${id}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vote }),
    });

    if (response.ok) {
      const payload = (await response.json()) as BackendProblemResponse;

      if (payload.data) {
        return attachFallbackAnalysis(payload.data);
      }
    }
  } catch {
  }

  const problems = await readAllProblems();
  const problemIndex = problems.findIndex((problem) => problem.id === id);

  if (problemIndex === -1) {
    return null;
  }

  const problem = problems[problemIndex];
  const votes = normalizeProblemVotes(problem.votes);

  votes[vote] += 1;
  problems[problemIndex] = {
    ...problem,
    votes,
  };

  await writeAllProblems(problems);
  return problems[problemIndex];
}
