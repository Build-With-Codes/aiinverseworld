import { promises as fs } from "node:fs";
import path from "node:path";

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
};

type CreateProblemInput = {
  title: string;
  description: string;
  industry: string;
  frequency: string;
  painScore: number;
  email?: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const problemsFile = path.join(dataDirectory, "problems.json");

const seedProblems: StoredProblem[] = [
  {
    id: "scheduling-staff-shifts",
    title: "Scheduling staff shifts is a nightmare",
    description:
      "We manage 50 employees across multiple stores and spend hours every week building schedules, handling swaps, and chasing confirmations.",
    industry: "Retail",
    frequency: "Every week",
    painScore: 9,
    createdAt: "2026-06-01T09:00:00.000Z",
    analysis: {
      whoHasThisProblem:
        "Multi-location retailers, restaurants, clinics, and service businesses with hourly staff run into this constantly.",
      severity:
        "This is a high-friction operational problem because it burns manager time every week and directly affects attendance, overtime, and customer coverage.",
      softwareFit:
        "Yes. Scheduling, shift swaps, availability capture, and notifications are all strong workflow software use cases.",
      aiFit:
        "Yes. AI can suggest optimized schedules, predict understaffing, and automate swap approvals or conflict detection.",
      marketOpportunity:
        "The opportunity is strong because the pain is recurring, measurable, and tied to labor efficiency and revenue protection.",
      opportunityScore: 92,
      startupIdeas: [
        "SaaS for auto-generating compliant employee schedules",
        "AI assistant for shift swaps and last-minute coverage",
        "WhatsApp-based scheduling tool for frontline teams",
      ],
    },
  },
  {
    id: "finding-reliable-contractors",
    title: "Finding reliable local contractors is difficult",
    description:
      "We waste days comparing vendors, checking references, and redoing work when local contractors miss deadlines or quality expectations.",
    industry: "Construction",
    frequency: "Every month",
    painScore: 8,
    createdAt: "2026-06-02T11:30:00.000Z",
    analysis: {
      whoHasThisProblem:
        "Construction firms, property managers, facilities teams, and homeowners with recurring project work all feel this pain.",
      severity:
        "The pain is serious because poor contractor selection increases delays, rework, and project risk.",
      softwareFit:
        "Yes. Vendor discovery, vetting, reputation data, and procurement workflows are a natural software category.",
      aiFit:
        "AI can help rank vendors, summarize reviews, flag risk signals, and match project requirements to contractor profiles.",
      marketOpportunity:
        "There is a healthy niche opportunity where trust, verification, and response speed create clear value.",
      opportunityScore: 84,
      startupIdeas: [
        "Verified local contractor marketplace for commercial projects",
        "AI scoring engine for contractor reliability and fit",
        "Project brief to contractor shortlist automation tool",
      ],
    },
  },
];

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
    await fs.writeFile(problemsFile, JSON.stringify(seedProblems, null, 2), "utf8");
  }
}

async function readAllProblems() {
  await ensureStore();
  const raw = await fs.readFile(problemsFile, "utf8");
  return JSON.parse(raw) as StoredProblem[];
}

async function writeAllProblems(problems: StoredProblem[]) {
  await fs.writeFile(problemsFile, JSON.stringify(problems, null, 2), "utf8");
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

export async function getProblems() {
  const problems = await readAllProblems();
  return problems.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getProblemById(id: string) {
  const problems = await readAllProblems();
  return problems.find((problem) => problem.id === id) ?? null;
}

export async function createProblem(input: CreateProblemInput) {
  const problems = await readAllProblems();
  const analysis = await generateProblemAnalysis(input);

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
  };

  problems.unshift(nextProblem);
  await writeAllProblems(problems);

  return nextProblem;
}
