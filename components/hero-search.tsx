"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AITool } from "@/lib/catalog-types";

const quickTags = ["AI for Sales", "Free Image Tools", "Code Assistants", "Education"];

function formatMatchScore(score?: number) {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return null;
  }

  const normalized = score <= 1 ? score * 100 : score;
  return `${Math.round(Math.min(Math.max(normalized, 0), 100))}% relevant`;
}

function getRecommendationErrorMessage(status: number) {
  if (status === 429) {
    return "Too many recommendation requests at once. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "The recommendation service is taking a break right now. Please try again in a few minutes.";
  }

  return "We could not generate recommendations for that request. Try a clearer use case, such as \"AI tool for YouTube thumbnails\".";
}

type RagPayload = {
  answer?: string;
  data?: Array<AITool & { recommendation?: { score: number; reason: string } }>;
  retrieval?: {
    strategy: string;
    embeddingModel: string;
    retrievedChunks?: number;
  };
};

export function HeroSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastAutoQuery = useRef("");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [tools, setTools] = useState<RagPayload["data"]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function recommendAi(nextQuery = query) {
    const trimmed = nextQuery.trim();

    if (!trimmed) {
      setAnswer("");
      setTools([]);
      setError("Tell us what you want to do, then we can recommend the right AI tools.");
      setHasSearched(true);
      setIsLoading(false);
      return;
    }

    setHasSearched(true);
    setQuery(trimmed);
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ q: trimmed, limit: "3" });
      const response = await fetch(`/api/tools/recommend/rag?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        setAnswer("");
        setTools([]);
        setError(getRecommendationErrorMessage(response.status));
        return;
      }

      const payload = (await response.json()) as RagPayload;
      const nextTools = payload.data ?? [];

      setAnswer(payload.answer ?? "");
      setTools(nextTools);

      if (payload.retrieval?.strategy === "unavailable") {
        setError("Recommendations are temporarily unavailable. Please try again soon.");
        return;
      }

      if (!nextTools.length) {
        setError(null);
      }
    } catch {
      setAnswer("");
      setTools([]);
      setError("Something went wrong while contacting the recommendation service. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      recommendAi();
    }
  }

  function selectPrompt(value: string) {
    setQuery(value);
    void recommendAi(value);
  }

  useEffect(() => {
    const requestedRecommendation = searchParams.get("recommend")?.trim() ?? "";

    if (!requestedRecommendation || requestedRecommendation === lastAutoQuery.current) {
      return;
    }

    lastAutoQuery.current = requestedRecommendation;
    void recommendAi(requestedRecommendation);
  }, [searchParams]);

  return (
    <div
      id="ai-finder"
      className="home-ai-finder rounded-[32px] bg-surface-3/82 p-4 shadow-[0_24px_120px_rgba(8,15,35,0.34)] backdrop-blur-2xl"
    >
  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
  {/* Search Input */}
  <div className="group relative min-w-0">
    <div
      className="
        platform-search-shell
        relative
        flex
        min-h-[60px]
        items-center
        rounded-2xl
        transition-all
        duration-300
      "
    >
      {/* AI Icon */}
      <span className="ml-5 shrink-0 text-xl text-cyan-300">
        ✦
      </span>

      <input
        aria-label="Search tools"
        placeholder="What do you want to do with AI?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="
          min-w-0
          flex-1
          platform-shell-input
          px-4
          py-2
          text-base
          placeholder:text-text-muted
        "
      />
    </div>
  </div>

  {/* Recommend Button */}
  <button
    onClick={() => recommendAi()}
    disabled={isLoading}
    className="
      group
      relative
      min-h-[60px]
      overflow-hidden
      rounded-full
      bg-gradient-to-r
      from-cyan-400
      via-indigo-500
      to-fuchsia-500
      px-6
      py-3
      text-sm
      font-semibold
      text-white
      shadow-[0_0_24px_rgba(99,102,241,0.25)]
      transition-all
      duration-300
      hover:scale-[1.03]
      hover:shadow-[0_0_32px_rgba(168,85,247,0.4)]
      disabled:opacity-60
    "
  >
    <span className="relative flex items-center justify-center gap-2">
      <span>✦</span>
      {isLoading ? "Finding..." : "Recommend AI"}
    </span>
  </button>
</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {quickTags.map((tag) => (
          <button
            key={tag}
            onClick={() => selectPrompt(tag)}
            disabled={isLoading}
            className="rounded-full bg-surface-2/78 px-3 py-2 text-xs text-text-secondary transition hover:bg-brand-cyan/10 hover:text-text-primary disabled:opacity-60"
          >
           ✦  {tag}
          </button>
        ))}
      </div>
      {hasSearched ? (
        <div className="home-ai-finder__results mt-4 overflow-hidden rounded-card border border-border-accent bg-surface-1/80 p-4">
          <div className="home-ai-finder__result-header flex flex-col gap-3 rounded-sm border border-border-subtle bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-brand-cyan-strong uppercase">Recommended for you</p>
              <p className="mt-1 text-sm text-text-muted">Personalized shortlist from the live catalog</p>
            </div>
            <div className="home-ai-finder__status inline-flex w-fit items-center gap-2 rounded-full border border-border-accent bg-brand-cyan/10 px-3 py-2 text-xs font-semibold text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden="true" />
              Live ranking
            </div>
          </div>

          {isLoading ? (
            <div className="mt-4 space-y-3" aria-busy="true">
              {[0, 1, 2].map((item) => (
                <div key={item} className="skeleton-shimmer h-16 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <div className="home-ai-finder__message home-ai-finder__message--error mt-4 rounded-sm border border-rose-300/20 bg-rose-300/10 p-4">
              <p className="text-sm font-semibold text-rose-100">Could not recommend tools</p>
              <p className="mt-2 text-sm leading-6 text-rose-200">{error}</p>
            </div>
          ) : tools?.length ? (
            <>
              {answer ? (
                <div className="home-ai-finder__answer mt-4 rounded-sm border border-border-subtle bg-surface-2 p-4">
                  <p className="text-sm font-semibold text-white">AI summary</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{answer}</p>
                </div>
              ) : null}
              <div className="mt-4 grid gap-3">
                {tools.map((tool, index) => {
                  const matchScore = formatMatchScore(tool.recommendation?.score);

                  return (
                    <button
                      key={tool.id}
                      onClick={() => router.push(`/tool/${tool.slug}?id=${encodeURIComponent(tool.id)}`)}
                      className="home-ai-finder__tool group rounded-2xl border border-border-subtle bg-surface-2 p-4 text-left transition hover:border-border-accent hover:bg-white/10"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="home-ai-finder__rank flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-border-accent bg-brand-cyan/10 text-sm font-semibold text-cyan-100">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{tool.name}</p>
                            <p className="mt-1 text-xs text-text-muted">{tool.category}</p>
                          </div>
                        </div>
                        {matchScore ? (
                          <span className="home-ai-finder__match shrink-0 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                            {matchScore}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-text-secondary">
                        {tool.recommendation?.reason ?? tool.shortDescription}
                      </p>
                      <p className="mt-3 text-xs font-semibold text-brand-cyan-strong transition group-hover:text-cyan-100">
                        View tool details
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="home-ai-finder__message mt-4 rounded-sm border border-border-subtle bg-surface-2 p-4">
              <p className="text-sm font-semibold text-white">No strong match found</p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {answer ||
                  "We could not find a confident recommendation for that request. Try adding your goal, audience, budget, or preferred format."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["AI tool for students", "Free tool for images", "AI for coding"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => selectPrompt(suggestion)}
                    className="rounded-full border border-border-accent bg-brand-cyan/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-brand-cyan/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
