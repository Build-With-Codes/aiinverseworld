"use client";

import { useEffect, useMemo, useState } from "react";
import { SavePromptButton } from "@/components/engagement/save-prompt-button";
import { PromptShareButton } from "@/components/prompts/prompt-share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { recordPromptEvent, type AiPrompt, type PromptsSearchResult, type PromptsSummary } from "@/lib/prompts-api";

type IconName =
  | "bot"
  | "bookmark"
  | "code"
  | "eye"
  | "file"
  | "flame"
  | "image"
  | "mail"
  | "message"
  | "plus"
  | "search"
  | "sparkles"
  | "star";

const tabs = [
  { label: "Featured", value: "featured", icon: "star", color: "text-amber-300" },
  { label: "Trending", value: "trending", icon: "flame", color: "text-orange-300" },
  { label: "Latest", value: "latest", icon: "plus", color: "text-sky-300" },
  { label: "Most Saved", value: "saved", icon: "bookmark", color: "text-violet-300" },
  { label: "Most Used", value: "used", icon: "eye", color: "text-emerald-300" },
  { label: "AI Recommended", value: "recommended", icon: "sparkles", color: "text-brand-cyan-strong" },
] satisfies Array<{ label: string; value: string; icon: IconName; color: string }>;

const categoryOptions = [
  { label: "All", value: "all" },
  { label: "Marketing", value: "marketing" },
  { label: "Content Writing", value: "content-writing" },
  { label: "Coding", value: "coding" },
  { label: "Business", value: "business" },
  { label: "Education", value: "education" },
  { label: "SEO", value: "seo" },
  { label: "Design", value: "design" },
  { label: "Agents", value: "agents" },
];

const fallbackModelOptions = ["all"];
const difficultyOptions = ["all", "Beginner", "Intermediate", "Advanced"];
const typeOptions = ["all", "System Prompt", "User Prompt", "Template", "Workflow", "Agent", "JSON", "Image Prompt", "Few-shot"];

function compactNumber(value?: number | null) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value ?? 0);
}

function fieldClass() {
  return "h-11 rounded-sm border border-border-subtle bg-surface-1/70 px-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-border-accent focus:bg-surface-1";
}

function PromptIcon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const baseProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "bot") {
    return (
      <svg {...baseProps}>
        <path d="M12 8V4" />
        <rect x="5" y="8" width="14" height="11" rx="3" />
        <path d="M8.5 13h.01" />
        <path d="M15.5 13h.01" />
        <path d="M9 17h6" />
      </svg>
    );
  }
  if (name === "bookmark") {
    return (
      <svg {...baseProps}>
        <path d="M6 4h12v16l-6-3-6 3V4z" />
      </svg>
    );
  }
  if (name === "code") {
    return (
      <svg {...baseProps}>
        <path d="m9 18 6-12" />
        <path d="m7 8-4 4 4 4" />
        <path d="m17 8 4 4-4 4" />
      </svg>
    );
  }
  if (name === "eye") {
    return (
      <svg {...baseProps}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (name === "file") {
    return (
      <svg {...baseProps}>
        <path d="M7 3h7l4 4v14H7V3z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    );
  }
  if (name === "flame") {
    return (
      <svg {...baseProps}>
        <path d="M12 22c4 0 7-3 7-7 0-3-2-5-4-7 .2 2-1 3-2.4 3.8C11.2 9 9 7.5 9 4c-2 1.5-4 4-4 8 0 6 4 10 7 10z" />
      </svg>
    );
  }
  if (name === "image") {
    return (
      <svg {...baseProps}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="m7 17 4-4 3 3 2-2 3 3" />
      </svg>
    );
  }
  if (name === "mail") {
    return (
      <svg {...baseProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  if (name === "message") {
    return (
      <svg {...baseProps}>
        <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.5-5A8 8 0 1 1 21 12z" />
      </svg>
    );
  }
  if (name === "plus") {
    return (
      <svg {...baseProps}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg {...baseProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }
  if (name === "sparkles") {
    return (
      <svg {...baseProps}>
        <path d="M12 3 10.4 8.4 5 10l5.4 1.6L12 17l1.6-5.4L19 10l-5.4-1.6L12 3z" />
        <path d="M19 15l-.8 2.2L16 18l2.2.8L19 21l.8-2.2L22 18l-2.2-.8L19 15z" />
      </svg>
    );
  }
  return (
    <svg {...baseProps}>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z" />
    </svg>
  );
}

function getPromptVisual(prompt: AiPrompt) {
  const text = `${prompt.title} ${prompt.promptType}`.toLowerCase();
  if (text.includes("email")) {
    return {
      icon: "mail" as const,
      gradient: "from-emerald-400 via-teal-400 to-cyan-500",
      glow: "shadow-[0_0_34px_rgba(45,212,191,0.28)]",
    };
  }
  if (text.includes("code")) {
    return {
      icon: "code" as const,
      gradient: "from-amber-300 via-orange-400 to-rose-500",
      glow: "shadow-[0_0_34px_rgba(251,146,60,0.28)]",
    };
  }
  if (text.includes("blog") || text.includes("content")) {
    return {
      icon: "file" as const,
      gradient: "from-sky-400 via-indigo-500 to-violet-500",
      glow: "shadow-[0_0_34px_rgba(99,102,241,0.28)]",
    };
  }
  if (text.includes("logo") || text.includes("image")) {
    return {
      icon: "image" as const,
      gradient: "from-fuchsia-400 via-purple-500 to-sky-500",
      glow: "shadow-[0_0_34px_rgba(217,70,239,0.28)]",
    };
  }
  if (text.includes("support") || text.includes("agent")) {
    return {
      icon: "bot" as const,
      gradient: "from-cyan-300 via-blue-500 to-emerald-400",
      glow: "shadow-[0_0_34px_rgba(34,211,238,0.26)]",
    };
  }
  return {
    icon: "message" as const,
    gradient: "from-brand-electric via-brand-violet to-brand-cyan",
    glow: "shadow-glow-cyan",
  };
}

function applyVariables(prompt: AiPrompt, values: Record<string, string>) {
  let output = prompt.prompt;
  for (const [key, value] of Object.entries(values)) {
    output = output.replaceAll(`{{${key}}}`, value || `{{${key}}}`);
  }
  return output;
}

function getInitialVariables(prompt?: AiPrompt | null) {
  const raw = prompt?.variables ?? prompt?.exampleInput ?? {};
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, String(value ?? "")]));
}

export function PromptsClient() {
  const [prompts, setPrompts] = useState<AiPrompt[]>([]);
  const [summary, setSummary] = useState<PromptsSummary | null>(null);
  const [meta, setMeta] = useState<PromptsSearchResult["meta"]>({ page: 1, limit: 8, total: 0, totalPages: 1 });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [model, setModel] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [promptType, setPromptType] = useState("all");
  const [activeTab, setActiveTab] = useState("featured");
  const [page, setPage] = useState(1);
  const [selectedPrompt, setSelectedPrompt] = useState<AiPrompt | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "8",
        tab: activeTab,
      });
      if (activeTab !== "featured") params.set("sort", activeTab);
      if (query.trim()) params.set("q", query.trim());
      if (category !== "all") params.set("category", category);
      if (model !== "all") params.set("model", model);
      if (difficulty !== "all") params.set("difficulty", difficulty);
      if (promptType !== "all") params.set("promptType", promptType);

      try {
        const [promptsResponse, statsResponse] = await Promise.all([
          fetch(`/api/prompts?${params.toString()}`, { cache: "no-store" }),
          fetch("/api/prompts/stats", { cache: "no-store" }),
        ]);
        const promptsPayload = (await promptsResponse.json()) as PromptsSearchResult;
        const statsPayload = (await statsResponse.json()) as PromptsSummary;
        if (cancelled) return;
        setPrompts(promptsPayload.data ?? []);
        setMeta(promptsPayload.meta ?? { page, limit: 8, total: 0, totalPages: 1 });
        setSummary(statsPayload);
        const nextSelected = promptsPayload.data?.[0] ?? null;
        setSelectedPrompt((current) => current ?? nextSelected);
        if (!selectedPrompt && nextSelected) setVariables(getInitialVariables(nextSelected));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [activeTab, category, difficulty, model, page, promptType, query, selectedPrompt]);

  const preview = useMemo(() => selectedPrompt ? applyVariables(selectedPrompt, variables) : "", [selectedPrompt, variables]);
  const modelOptions = useMemo(
    () => [
      "all",
      ...((summary?.models ?? [])
        .map((item) => item.name)
        .filter(Boolean)
        .slice(0, 10)),
    ],
    [summary],
  );
  const sidebarCategories = useMemo(
    () => (summary?.categories ?? []).slice(0, 8),
    [summary],
  );
  const searchIdeas = useMemo(
    () => (summary?.suggestions ?? []).filter(Boolean).slice(0, 10),
    [summary],
  );

  function resetFilters() {
    setCategory("all");
    setModel("all");
    setDifficulty("all");
    setPromptType("all");
    setQuery("");
    setActiveTab("featured");
    setPage(1);
  }

  async function copyPrompt(prompt: AiPrompt) {
    await navigator.clipboard?.writeText(applyVariables(prompt, prompt.slug === selectedPrompt?.slug ? variables : getInitialVariables(prompt)));
    recordPromptEvent(prompt.slug, "copy");
    setPrompts((current) =>
      current.map((item) =>
        item.id === prompt.id
          ? {
              ...item,
              stats: {
                views: item.stats?.views ?? 0,
                copies: (item.stats?.copies ?? 0) + 1,
                saves: item.stats?.saves ?? 0,
                likes: item.stats?.likes ?? 0,
                shares: item.stats?.shares,
                weeklyGrowth: item.stats?.weeklyGrowth,
              },
            }
          : item,
      ),
    );
    setCopiedSlug(prompt.slug);
    window.setTimeout(() => setCopiedSlug(null), 1400);
  }

  function selectPrompt(prompt: AiPrompt) {
    setSelectedPrompt(prompt);
    setVariables(getInitialVariables(prompt));
  }

  return (
    <div className="pt-8">
      <section className="relative overflow-hidden rounded-card-lg border border-border-subtle bg-surface-2/85 px-5 py-7 shadow-card backdrop-blur-xl sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-violet/18 blur-3xl" />
        <div className="pointer-events-none absolute left-12 top-20 h-48 w-48 rounded-full bg-brand-cyan/12 blur-3xl" />
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.75fr] lg:items-center">
          <div className="relative">
            <Badge variant="brand">Prompt Library</Badge>
            <h1 className="mt-5 max-w-3xl text-display-2 text-text-primary">
              Discover, optimize and share production-ready AI prompts
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Search natural language goals, customize variables, compare model fit, and copy prompts built for real workflows.
            </p>
            <form
              className="mt-7 flex flex-col gap-3 rounded-card border border-border-subtle bg-surface-1/85 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                setPage(1);
              }}
            >
              <label className="flex min-h-12 flex-1 items-center gap-3 rounded-sm px-4">
                <PromptIcon name="search" className="h-5 w-5 shrink-0 text-brand-cyan-strong" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                  className="min-w-0 flex-1 border-0 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                  placeholder='Search prompts, e.g. "Write a marketing email..."'
                  aria-label="Search prompts"
                />
              </label>
              <Button type="submit" className="rounded-sm px-7">Search</Button>
            </form>
            {searchIdeas.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchIdeas.map((idea) => (
                  <button
                    key={idea}
                    type="button"
                    onClick={() => {
                      setQuery(idea);
                      setPage(1);
                    }}
                    className="rounded-pill border border-border-subtle bg-surface-2 px-3 py-1.5 text-xs font-semibold text-text-muted transition hover:border-border-accent hover:text-text-primary"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative min-h-64 overflow-hidden rounded-card border border-border-subtle bg-surface-1/80 p-6 shadow-card">
            <div className="absolute inset-x-10 top-10 h-28 rounded-full bg-brand-violet/18 blur-3xl" />
            <div className="relative mx-auto flex h-56 max-w-sm items-center justify-center">
              <div className="absolute bottom-4 h-8 w-56 rounded-full bg-brand-cyan/20 blur-xl" />
              <div className="relative grid h-36 w-36 place-items-center rounded-[2rem] bg-gradient-to-br from-brand-electric to-brand-violet shadow-glow-violet">
                <PromptIcon name="message" className="h-16 w-16 text-white" />
              </div>
              <div className="absolute left-4 top-8 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-[0_18px_50px_rgba(45,212,191,0.28)]">
                <PromptIcon name="mail" className="h-7 w-7" />
              </div>
              <div className="absolute bottom-8 right-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-rose-500 text-white shadow-[0_18px_50px_rgba(251,146,60,0.28)]">
                <PromptIcon name="code" className="h-7 w-7" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-3 border-t border-border-subtle pt-6 sm:grid-cols-4">
          {[
            [compactNumber(summary?.total), "Prompts"],
            [compactNumber(summary?.categories?.length), "Categories"],
            [compactNumber(summary?.models?.length), "AI Models"],
            [compactNumber(summary?.copies), "Copies"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-sm border border-border-subtle bg-surface-2/70 p-4">
              <p className="text-2xl font-bold text-text-primary">{value}</p>
              <p className="mt-1 text-sm text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          <div className="grid gap-3 rounded-card border border-border-subtle bg-surface-2/55 p-4 sm:grid-cols-2 xl:grid-cols-5">
            <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className={fieldClass()}>
              {categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <select value={model} onChange={(event) => { setModel(event.target.value); setPage(1); }} className={fieldClass()}>
              {(modelOptions.length > 1 ? modelOptions : fallbackModelOptions).map((option) => <option key={option} value={option}>{option === "all" ? "AI Model" : option}</option>)}
            </select>
            <select value={difficulty} onChange={(event) => { setDifficulty(event.target.value); setPage(1); }} className={fieldClass()}>
              {difficultyOptions.map((option) => <option key={option} value={option}>{option === "all" ? "Difficulty" : option}</option>)}
            </select>
            <select value={promptType} onChange={(event) => { setPromptType(event.target.value); setPage(1); }} className={fieldClass()}>
              {typeOptions.map((option) => <option key={option} value={option}>{option === "all" ? "Prompt Type" : option}</option>)}
            </select>
            <Button type="button" variant="secondary" className="rounded-sm" onClick={resetFilters}>Reset</Button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setActiveTab(tab.value);
                  setPage(1);
                }}
                className={`shrink-0 rounded-pill border px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.value
                    ? "border-border-accent bg-brand-cyan/12 text-text-primary shadow-glow-cyan"
                    : "border-border-subtle bg-surface-2 text-text-muted hover:border-border-accent hover:text-text-primary"
                }`}
              >
                <PromptIcon name={tab.icon} className={`mr-2 inline-block h-4 w-4 ${tab.color}`} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text-primary">{loading ? "Searching prompts..." : `${prompts.length} visible prompts`}</p>
              <p className="text-sm text-text-muted">{meta.total ? `${compactNumber(meta.total)} total` : "Workspace ready"}</p>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="grid animate-pulse gap-4 rounded-card border border-border-subtle bg-surface-2/60 p-4 shadow-card sm:grid-cols-[5.5rem_1fr_auto]"
                  >
                    <div className="h-[5.5rem] w-[5.5rem] rounded-[1.35rem] bg-surface-1" />
                    <div className="min-w-0 space-y-3">
                      <div className="h-4 w-28 rounded-full bg-surface-1" />
                      <div className="h-6 w-2/3 rounded-full bg-surface-1" />
                      <div className="h-4 w-full rounded-full bg-surface-1" />
                      <div className="h-4 w-4/5 rounded-full bg-surface-1" />
                      <div className="flex gap-2">
                        <div className="h-6 w-20 rounded-full bg-surface-1" />
                        <div className="h-6 w-24 rounded-full bg-surface-1" />
                        <div className="h-6 w-16 rounded-full bg-surface-1" />
                      </div>
                    </div>
                    <div className="flex gap-2 sm:w-32 sm:flex-col">
                      <div className="h-9 rounded-sm bg-surface-1 sm:w-full" />
                      <div className="h-9 rounded-sm bg-surface-1 sm:w-full" />
                      <div className="h-9 rounded-sm bg-surface-1 sm:w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {!loading && prompts.map((prompt) => {
              const visual = getPromptVisual(prompt);

              return (
                <article
                  key={prompt.slug}
                  className="group grid gap-4 rounded-card border border-border-subtle bg-surface-2/60 p-4 shadow-card transition hover:border-border-accent hover:bg-surface-2 sm:grid-cols-[5.5rem_1fr_auto]"
                >
                  <button
                    type="button"
                    onClick={() => selectPrompt(prompt)}
                    className={`relative grid h-[5.5rem] w-[5.5rem] place-items-center overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${visual.gradient} text-lg font-black text-white ${visual.glow}`}
                    aria-label={`Preview ${prompt.title}`}
                  >
                    <span className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-white/18" />
                    <PromptIcon name={visual.icon} className="relative h-9 w-9" />
                  </button>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {prompt.featured ? <Badge variant="brand" className="py-0.5">Featured</Badge> : null}
                      <span className="rounded-pill bg-amber-300/10 px-2 py-1 text-xs font-semibold text-amber-300">Score {prompt.qualityScore}</span>
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-text-primary">{prompt.title}</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">{prompt.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[...prompt.categories.map((item) => item.name), prompt.promptType, ...prompt.supportedModels.slice(0, 3)].map((chip) => (
                        <span key={chip} className="rounded-pill bg-surface-1 px-3 py-1 text-xs font-semibold text-text-muted">{chip}</span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-text-muted">
                      <span>Rating {(prompt.qualityScore / 20).toFixed(1)}</span>
                      <span>Views {compactNumber(prompt.stats?.views)}</span>
                      <span>Copies {compactNumber(prompt.stats?.copies)}</span>
                      <span>Saves {compactNumber(prompt.stats?.saves)}</span>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 sm:w-32 sm:flex-col">
                    <Button type="button" size="sm" className="rounded-sm" onClick={() => copyPrompt(prompt)}>
                      {copiedSlug === prompt.slug ? "Copied" : "Copy"}
                    </Button>
                    <PromptShareButton
                      slug={prompt.slug}
                      title={prompt.title}
                      description={prompt.description}
                      className="inline-flex items-center justify-center rounded-sm border border-border-subtle bg-surface-2 px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-border-accent hover:text-text-primary"
                    />
                    <SavePromptButton
                      promptId={prompt.id}
                      promptTitle={prompt.title}
                      callbackUrl="/prompts"
                      className="inline-flex items-center justify-center gap-2 rounded-sm border border-border-subtle bg-surface-2 px-3 py-2 text-sm font-semibold text-text-secondary transition hover:border-border-accent hover:text-text-primary"
                    />
                    <Button href={`/prompts/${prompt.slug}`} size="sm" variant="ghost" className="rounded-sm">View Details</Button>
                  </div>
                </article>
              );
            })}
            {!loading && prompts.length === 0 ? (
              <div className="rounded-card border border-border-subtle bg-surface-2/70 p-8 text-center shadow-card">
                <p className="text-lg font-bold text-text-primary">No prompts in the workspace yet</p>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                  The Prompt Library is wired to the job-service database. Start the scheduler with prompt source URLs, or run the sync endpoint after migrations create the prompt tables.
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-card border border-border-subtle bg-surface-2/60 p-4">
            <Button type="button" variant="secondary" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
            <p className="text-sm font-semibold text-text-muted">Page {meta.page} of {meta.totalPages}</p>
            <Button type="button" variant="secondary" disabled={page >= meta.totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-card border border-border-subtle bg-surface-2/70 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Variable Playground</h2>
              <Badge variant="success">Live</Badge>
            </div>
            {selectedPrompt ? (
              <div className="mt-4 space-y-4">
                <p className="text-sm font-semibold text-text-primary">{selectedPrompt.title}</p>
                {Object.keys(variables).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(variables).map(([key, value]) => (
                      <label key={key} className="block">
                        <span className="text-xs font-semibold uppercase text-text-muted">{key}</span>
                        <input
                          value={value}
                          onChange={(event) => setVariables((current) => ({ ...current, [key]: event.target.value }))}
                          className={`${fieldClass()} mt-1`}
                        />
                      </label>
                    ))}
                  </div>
                ) : null}
                <pre className="max-h-72 overflow-auto rounded-sm border border-border-subtle bg-surface-1 p-4 text-xs leading-6 text-text-secondary whitespace-pre-wrap">{preview}</pre>
                <Button type="button" className="w-full rounded-sm" onClick={() => selectedPrompt && copyPrompt(selectedPrompt)}>Generate Preview Copy</Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-text-muted">Select a prompt to customize variables.</p>
            )}
          </div>

          <div className="rounded-card border border-border-subtle bg-surface-2/70 p-5">
            <h2 className="text-lg font-bold text-text-primary">Categories</h2>
            <div className="mt-4 space-y-3">
              {sidebarCategories.length > 0 ? sidebarCategories.map((item) => (
                <button key={item.slug} type="button" onClick={() => setCategory(item.slug)} className="flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm text-text-secondary transition hover:bg-surface-1 hover:text-text-primary">
                  <span>{item.name}</span>
                  <span>{compactNumber(item.count)}</span>
                </button>
              )) : <p className="text-sm leading-6 text-text-muted">Categories will appear after the prompt sync stores records.</p>}
            </div>
          </div>

          <div className="rounded-card border border-border-subtle bg-surface-2/70 p-5">
            <h2 className="text-lg font-bold text-text-primary">Top Models</h2>
            <div className="mt-4 space-y-3">
              {(summary?.models ?? []).slice(0, 6).map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-sm border border-border-subtle bg-surface-1/60 px-3 py-2 text-sm">
                  <span className="font-semibold text-text-primary">{item.name}</span>
                  <span className="text-text-muted">{compactNumber(item.count)} prompts</span>
                </div>
              ))}
              {!summary?.models?.length ? <p className="text-sm leading-6 text-text-muted">Model counts will populate from saved prompt metadata.</p> : null}
            </div>
          </div>

          <div className="rounded-card border border-border-accent bg-brand-cyan/10 p-5">
            <h2 className="text-lg font-bold text-text-primary">Prompt Library</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Save useful prompts to your account, copy them into your workflow, and track the prompts people use most.
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-8 grid gap-3 rounded-card-lg border border-border-subtle bg-surface-2/65 p-5 sm:grid-cols-4">
        {[
          [compactNumber(summary?.total), "Prompts"],
          [compactNumber(summary?.copies), "Times copied"],
          [compactNumber(summary?.saves), "Times saved"],
          [compactNumber(summary?.views), "Total views"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-sm border border-border-subtle bg-surface-1/70 p-4">
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            <p className="text-sm text-text-muted">{label}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
