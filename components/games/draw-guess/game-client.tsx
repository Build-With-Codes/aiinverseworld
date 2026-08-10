"use client";

import { useEffect, useMemo, useState } from "react";

import { getHints } from "@/lib/games/draw-guess/hints";
import { calculateScore } from "@/lib/games/draw-guess/scoring";
import { emptyStats, readStats, writeStats } from "@/lib/games/draw-guess/stats";
import type {
  DrawGuessCategory,
  DrawGuessDifficulty,
  DrawGuessRoundResponse,
  DrawGuessStats,
} from "@/types/draw-guess";
import {
  drawGuessCategories,
  drawGuessDifficulties,
} from "@/types/draw-guess";

const ROUND_DURATION_SECONDS = 60;
const MIN_REVEAL_INTERVAL_MS = 650;

type ParsedSvg = {
  openingTag: string;
  closingTag: string;
  parts: string[];
};

type RoundState = DrawGuessRoundResponse & {
  parsedSvg: ParsedSvg;
};

function normalizeGuess(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function parseSvg(svg: string): ParsedSvg {
  const match = svg.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/i);

  if (!match) {
    return {
      openingTag:
        '<svg class="draw-guess-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none" stroke="#22d3ee" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">',
      closingTag: "</svg>",
      parts: [],
    };
  }

  const openingTag = `<svg class="draw-guess-svg"${match[1]}>`;
  const body = match[2];
  const parts =
    body.match(
      /<(path|circle|rect|ellipse|line|polygon|polyline)\b[\s\S]*?\/>|<(path|circle|rect|ellipse|line|polygon|polyline)\b[\s\S]*?<\/\1>/gi,
    ) ?? [];

  return {
    openingTag,
    closingTag: "</svg>",
    parts: parts.map((part, index) =>
      part.replace(
        /^<([a-z]+)/i,
        `<$1 class="draw-guess-stroke draw-guess-stroke-${index}"`,
      ),
    ),
  };
}

function buildVisibleSvg(parsedSvg: ParsedSvg, revealedCount: number) {
  return `${parsedSvg.openingTag}${parsedSvg.parts.slice(0, revealedCount).join("")}${parsedSvg.closingTag}`;
}

export function DrawGuessGameClient() {
  const [category, setCategory] = useState<DrawGuessCategory>("Animals");
  const [difficulty, setDifficulty] = useState<DrawGuessDifficulty>("Easy");
  const [round, setRound] = useState<RoundState | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "won" | "lost">("idle");
  const [revealedCount, setRevealedCount] = useState(0);
  const [guess, setGuess] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<DrawGuessStats>(emptyStats);
  const [soundEnabled, setSoundEnabled] = useState(true);

  function playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
  ) {
    if (!soundEnabled || typeof window === "undefined") {
      return;
    }

    const audioContext = new window.AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + duration / 1000,
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration / 1000);
    oscillator.onended = () => {
      void audioContext.close();
    };
  }

  useEffect(() => {
    setStats(readStats());
  }, []);

  useEffect(() => {
    if (status !== "playing") {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) =>
        current + 1 >= ROUND_DURATION_SECONDS ? ROUND_DURATION_SECONDS : current + 1,
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "playing" || !round) {
      return;
    }

    if (elapsedSeconds >= ROUND_DURATION_SECONDS) {
      setStatus("lost");
      setMessage(`Time's up - the answer was ${round.answer}.`);
      const nextStats = {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        currentStreak: 0,
      };
      setStats(nextStats);
      writeStats(nextStats);
      return;
    }

    if (revealedCount >= round.parsedSvg.parts.length) {
      return;
    }

    const revealInterval = Math.max(
      MIN_REVEAL_INTERVAL_MS,
      Math.floor((ROUND_DURATION_SECONDS * 1000) / Math.max(round.parsedSvg.parts.length, 1)),
    );

    const revealTimer = window.setTimeout(() => {
      setRevealedCount((current) => current + 1);
      playTone(420, 90, "triangle");
    }, revealInterval);

    return () => window.clearTimeout(revealTimer);
  }, [elapsedSeconds, revealedCount, round, status, stats]);

  const hints = useMemo(() => {
    if (!round) {
      return [];
    }

    return getHints(round.answer, round.category, elapsedSeconds);
  }, [elapsedSeconds, round]);

  const visibleSvg = useMemo(() => {
    if (!round) {
      return "";
    }

    return buildVisibleSvg(round.parsedSvg, revealedCount);
  }, [revealedCount, round]);

  async function startRound() {
    setStatus("loading");
    setGuess("");
    setElapsedSeconds(0);
    setScore(null);
    setMessage("");
    setRevealedCount(0);

    const response = await fetch("/api/games/draw-guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, difficulty }),
    });

    if (!response.ok) {
      setStatus("idle");
      setMessage("Could not start the round. Please try again.");
      return;
    }

    const payload = (await response.json()) as DrawGuessRoundResponse;
    const parsedSvg = parseSvg(payload.svg);

    setRound({
      ...payload,
      parsedSvg,
    });
    setRevealedCount(Math.min(1, parsedSvg.parts.length));
    setStatus("playing");
  }

  function submitGuess() {
    if (!round || status !== "playing") {
      return;
    }

    const correct = normalizeGuess(guess) === normalizeGuess(round.answer);

    if (!correct) {
      setMessage("Not quite - keep guessing.");
      playTone(180, 180, "sawtooth");
      setGuess("");
      return;
    }

    const nextScore = calculateScore({
      totalParts: round.parsedSvg.parts.length,
      revealedParts: revealedCount,
      elapsedSeconds,
      hintsUsed: hints.length,
    });
    const nextStats = {
      gamesPlayed: stats.gamesPlayed + 1,
      wins: stats.wins + 1,
      bestScore: Math.max(stats.bestScore, nextScore),
      currentStreak: stats.currentStreak + 1,
    };

    setStats(nextStats);
    writeStats(nextStats);
    setScore(nextScore);
    setStatus("won");
    setMessage(`Correct! The answer was ${round.answer}.`);
    setRevealedCount(round.parsedSvg.parts.length);
    playTone(660, 120, "triangle");
    window.setTimeout(() => playTone(880, 180, "triangle"), 110);
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-6">
          <p className="text-xs font-semibold tracking-[0.28em] text-brand-cyan-strong uppercase">
            Game Setup
          </p>
          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {drawGuessCategories.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      category === option
                        ? "border-border-accent bg-brand-cyan/10 text-white"
                        : "border-border-subtle bg-surface-1 text-text-secondary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-3">
                {drawGuessDifficulties.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setDifficulty(option)}
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      difficulty === option
                        ? "border-violet-300/35 bg-violet-300/12 text-white"
                        : "border-border-subtle bg-surface-1 text-text-secondary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={startRound}
              disabled={status === "loading"}
              className="w-full rounded-2xl bg-brand-electric-strong px-5 py-4 text-sm font-semibold text-white transition hover:bg-brand-electric disabled:opacity-60"
            >
              {status === "loading" ? "Starting..." : "Start Game"}
            </button>
          </div>
        </div>

        <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-emerald-200 uppercase">
                Live Round
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                Guess the drawing within one minute.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
              <span className="rounded-full border border-border-subtle px-3 py-2">
                {Math.max(0, ROUND_DURATION_SECONDS - elapsedSeconds)}s left
              </span>
              <span className="rounded-full border border-border-subtle px-3 py-2">
                {round ? `${revealedCount}/${round.parsedSvg.parts.length} parts` : "0/0 parts"}
              </span>
              <button
                type="button"
                onClick={() => setSoundEnabled((current) => !current)}
                className="rounded-full border border-border-subtle px-3 py-2"
              >
                {soundEnabled ? "Sound On" : "Sound Off"}
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-card border border-border-subtle bg-surface-1 p-4">
            <div className="flex aspect-square items-center justify-center rounded-card border border-border-subtle bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_36%),#060d18] p-4">
              {visibleSvg ? (
                <div
                  className="draw-guess-canvas h-full w-full text-white"
                  dangerouslySetInnerHTML={{ __html: visibleSvg }}
                />
              ) : (
                <p className="text-sm text-text-muted">
                  Start a round to see the drawing.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
            <input
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  submitGuess();
                }
              }}
              placeholder="Type your guess"
              className="rounded-2xl border border-border-subtle bg-surface-1 px-4 py-4 text-sm text-white outline-none"
            />
            <button
              type="button"
              onClick={submitGuess}
              disabled={status !== "playing"}
              className="rounded-2xl border border-border-accent bg-brand-cyan/10 px-5 py-4 text-sm font-semibold text-cyan-100 disabled:opacity-50"
            >
              Submit Guess
            </button>
          </div>

          {message ? (
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface-2 px-4 py-3 text-sm text-slate-200">
              {message}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {hints.length > 0 ? (
              hints.map((hint) => (
                <span
                  key={hint}
                  className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-2 text-xs text-amber-100"
                >
                  {hint}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-border-subtle px-3 py-2 text-xs text-text-muted">
                Hints unlock at 20s, 40s, and 55s
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Games Played", value: stats.gamesPlayed },
          { label: "Wins", value: stats.wins },
          { label: "Best Score", value: stats.bestScore },
          { label: "Current Streak", value: stats.currentStreak },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-card border border-border-subtle bg-surface-2 p-5"
          >
            <p className="text-sm text-text-muted">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </section>

      {status === "won" || status === "lost" ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-[32px] border border-border-subtle bg-surface-1 p-7 shadow-[0_24px_120px_rgba(2,6,23,0.5)]">
            <p className="text-xs font-semibold tracking-[0.28em] text-brand-cyan-strong uppercase">
              {status === "won" ? "Round Complete" : "Round Over"}
            </p>
            <h3 className="mt-4 text-3xl font-semibold text-white">
              {status === "won" ? "Nice guess!" : "Better luck next round"}
            </h3>
            <p className="mt-3 text-base leading-7 text-text-secondary">
              {message}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border-subtle bg-surface-2 p-4">
                <p className="text-sm text-text-muted">Answer</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {round?.answer ?? "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-2 p-4">
                <p className="text-sm text-text-muted">Score</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {score ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-2 p-4">
                <p className="text-sm text-text-muted">Time</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {elapsedSeconds}s
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startRound}
                className="rounded-2xl bg-brand-electric-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-electric"
              >
                Next Round
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                  setScore(null);
                }}
                className="rounded-2xl border border-border-subtle px-5 py-3 text-sm font-medium text-text-secondary transition hover:border-border-accent hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
