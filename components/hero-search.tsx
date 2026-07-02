"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AITool } from "@/lib/catalog-types";

const quickTags = ["AI for Sales", "Free Image Tools", "Code Assistants", "Education"];

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
      setError(null);
      setHasSearched(false);
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
        throw new Error("AI Finder request failed");
      }

      const payload = (await response.json()) as RagPayload;
      setAnswer(payload.answer ?? "");
      setTools(payload.data ?? []);
    } catch {
      setAnswer("");
      setTools([]);
      setError("We could not get recommendations right now. Please try again.");
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
      className="rounded-[32px] border border-white/10 bg-white/8 p-4 shadow-[0_24px_120px_rgba(8,15,35,0.45)] backdrop-blur-2xl"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          aria-label="Search tools"
          placeholder="Search AI tools by use case, price, or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-2xl border border-white/10 bg-[#071120] px-5 py-4 text-sm text-slate-300 outline-none placeholder:text-slate-500 focus:border-cyan-300/30"
        />
        <button
          onClick={() => recommendAi()}
          disabled={isLoading}
          className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
        >
          {isLoading ? "Finding..." : "Recommend AI"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {quickTags.map((tag) => (
          <button
            key={tag}
            onClick={() => selectPrompt(tag)}
            disabled={isLoading}
            className="rounded-full border border-white/8 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-300/20 hover:text-white disabled:opacity-60"
          >
            {tag}
          </button>
        ))}
      </div>
      {hasSearched ? (
        <div className="mt-4 rounded-[24px] border border-cyan-300/15 bg-[#071120]/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-cyan-200 uppercase">Recommended AI</p>
          </div>

          {isLoading ? (
            <div className="mt-4 space-y-3" aria-busy="true">
              {[0, 1, 2].map((item) => (
                <div key={item} className="skeleton-shimmer h-16 rounded-2xl" />
              ))}
            </div>
          ) : error ? (
            <p className="mt-4 text-sm text-rose-200">{error}</p>
          ) : tools?.length ? (
            <>
              {answer ? <p className="mt-3 text-sm leading-6 text-slate-300">{answer}</p> : null}
              <div className="mt-4 grid gap-3">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => router.push(`/tool/${tool.slug}?id=${encodeURIComponent(tool.id)}`)}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/30 hover:bg-white/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{tool.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{tool.category}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {tool.recommendation?.reason ?? tool.shortDescription}
                    </p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              Describe what you need, then click Recommend AI.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
