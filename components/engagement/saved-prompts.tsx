"use client";

import { useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchSavedPrompts, savePrompt, unsavePrompt } from "@/lib/prompts-api";

type SavedPromptsContext = {
  savedIds: Set<string>;
  count: number;
  ready: boolean;
  signedIn: boolean;
  has: (promptId: string) => boolean;
  toggle: (promptId: string) => Promise<void>;
};

const Ctx = createContext<SavedPromptsContext | null>(null);

export function SavedPromptsProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!signedIn) {
      setSavedIds(new Set());
      setReady(true);
      return;
    }

    setReady(false);
    fetchSavedPrompts().then((prompts) => {
      if (cancelled) return;
      setSavedIds(new Set(prompts.map((prompt) => prompt.id)));
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [signedIn]);

  const has = useCallback((promptId: string) => savedIds.has(promptId), [savedIds]);

  const toggle = useCallback(
    async (promptId: string) => {
      if (!signedIn) return;
      const wasSaved = savedIds.has(promptId);

      setSavedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(promptId);
        else next.add(promptId);
        return next;
      });

      const newState = wasSaved ? await unsavePrompt(promptId) : await savePrompt(promptId);
      const success = wasSaved ? newState === false : newState === true;

      if (!success) {
        setSavedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(promptId);
          else next.delete(promptId);
          return next;
        });
      }
    },
    [signedIn, savedIds],
  );

  const value = useMemo<SavedPromptsContext>(
    () => ({ savedIds, count: savedIds.size, ready, signedIn, has, toggle }),
    [savedIds, ready, signedIn, has, toggle],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSavedPrompts() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSavedPrompts must be used within SavedPromptsProvider");
  return ctx;
}
