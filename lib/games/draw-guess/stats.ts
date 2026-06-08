"use client";

import type { DrawGuessStats } from "@/types/draw-guess";

const storageKey = "draw-guess-stats";

export const emptyStats: DrawGuessStats = {
  gamesPlayed: 0,
  wins: 0,
  bestScore: 0,
  currentStreak: 0,
};

export function readStats() {
  if (typeof window === "undefined") {
    return emptyStats;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? ({ ...emptyStats, ...JSON.parse(raw) } as DrawGuessStats) : emptyStats;
  } catch {
    return emptyStats;
  }
}

export function writeStats(stats: DrawGuessStats) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(stats));
}
