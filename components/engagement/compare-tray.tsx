"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { recordEvent } from "@/lib/engagement-client";

export type CompareEntry = {
  id: string;
  slug: string;
  name: string;
};

type CompareTrayContext = {
  items: CompareEntry[];
  has: (id: string) => boolean;
  toggle: (entry: CompareEntry) => void;
  remove: (id: string) => void;
  clear: () => void;
  max: number;
};

const MAX_COMPARE = 4;
const STORAGE_KEY = "aiverse-compare-tray";

const CompareContext = createContext<CompareTrayContext | null>(null);

export function CompareTrayProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CompareEntry[]);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const has = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const toggle = useCallback((entry: CompareEntry) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === entry.id)) {
        return prev.filter((i) => i.id !== entry.id);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      recordEvent({ type: "compare", toolId: entry.id, metadata: { action: "add" } });
      return [...prev, entry];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, has, toggle, remove, clear, max: MAX_COMPARE }),
    [items, has, toggle, remove, clear],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompareTray() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompareTray must be used within CompareTrayProvider");
  }
  return ctx;
}

/** Sticky bottom bar shown whenever the compare tray has items. */
export function CompareBar() {
  const { items, remove, clear } = useCompareTray();

  if (items.length === 0) return null;

  const compareHref =
    items.length >= 2
      ? `/compare?ids=${items.map((i) => encodeURIComponent(i.id)).join(",")}`
      : null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4" role="status" aria-live="polite">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 rounded-pill border border-border-accent bg-surface-glass px-4 py-3 shadow-card-hover backdrop-blur-xl">
        <span className="text-caption font-semibold text-brand-cyan-strong">
          Compare ({items.length}/4)
        </span>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {items.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 rounded-pill border border-border-subtle bg-surface-2 px-3 py-1 text-sm text-text-secondary"
            >
              {item.name}
              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove ${item.name} from compare`}
                className="text-text-muted transition hover:text-text-primary"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="text-caption text-text-muted transition hover:text-text-primary"
          >
            Clear
          </button>
          {compareHref ? (
            <Link
              href={compareHref}
              className="rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-5 py-2 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
            >
              Compare →
            </Link>
          ) : (
            <span className="text-caption text-text-muted">Add one more</span>
          )}
        </div>
      </div>
    </div>
  );
}
