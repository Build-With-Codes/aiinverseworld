"use client";

import { useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { burstConfetti } from "@/lib/confetti";
import { fetchSaved, saveTool, unsaveTool } from "@/lib/engagement-client";

type SavedToolsContext = {
  savedIds: Set<string>;
  count: number;
  ready: boolean;
  signedIn: boolean;
  has: (toolId: string) => boolean;
  toggle: (toolId: string) => Promise<void>;
};

const Ctx = createContext<SavedToolsContext | null>(null);

export function SavedToolsProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const firstSaveDone = useRef(false);

  useEffect(() => {
    let cancelled = false;
    if (!signedIn) {
      setSavedIds(new Set());
      setReady(true);
      return;
    }
    setReady(false);
    fetchSaved().then((tools) => {
      if (cancelled) return;
      const ids = new Set(tools.map((t) => t.id));
      firstSaveDone.current = ids.size > 0;
      setSavedIds(ids);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  const has = useCallback((toolId: string) => savedIds.has(toolId), [savedIds]);

  const toggle = useCallback(
    async (toolId: string) => {
      if (!signedIn) return;
      const wasSaved = savedIds.has(toolId);

      // Optimistic update.
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(toolId);
        else next.add(toolId);
        return next;
      });

      if (!wasSaved && !firstSaveDone.current) {
        firstSaveDone.current = true;
        burstConfetti();
      }

      // saveTool resolves to the new saved-state (true); unsaveTool resolves to
      // the new saved-state (false). Success = state matches our intent.
      const newState = wasSaved ? await unsaveTool(toolId) : await saveTool(toolId);
      const success = wasSaved ? newState === false : newState === true;

      if (!success) {
        // Revert on failure.
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(toolId);
          else next.delete(toolId);
          return next;
        });
      }
    },
    [signedIn, savedIds],
  );

  const value = useMemo<SavedToolsContext>(
    () => ({ savedIds, count: savedIds.size, ready, signedIn, has, toggle }),
    [savedIds, ready, signedIn, has, toggle],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSavedTools() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSavedTools must be used within SavedToolsProvider");
  return ctx;
}
