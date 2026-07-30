"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FaviconBadge } from "@/components/favicon-badge";

export type ToolOption = {
  value: string;
  slug: string;
  label: string;
  favicon: string;
  category: string;
};

function ToolCombobox({
  label,
  value,
  onChange,
  options,
  excludeValue,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ToolOption[];
  excludeValue: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((option) => option.value === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter((option) => option.value !== excludeValue)
      .filter((option) => !q || option.label.toLowerCase().includes(q) || option.category.toLowerCase().includes(q))
      .slice(0, 40);
  }, [options, query, excludeValue]);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function openPicker() {
    setQuery("");
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function pick(option: ToolOption) {
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative flex-1 space-y-2">
      <label className="text-xs font-semibold tracking-widest text-text-muted uppercase">{label}</label>

      {open ? (
        <div className="rounded-card bg-surface-1/82 p-2 shadow-card">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="platform-filter-input px-3.5 py-2.5 text-sm"
          />
          <div className="no-scrollbar mt-2 max-h-64 space-y-0.5 overflow-y-auto">
            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => pick(option)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-surface-3"
              >
                <FaviconBadge
                  name={option.label}
                  faviconUrl={option.favicon}
                  className="h-8 w-8 shrink-0 rounded-xl"
                  imgClassName="p-1"
                  labelClassName="text-xs"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-text-primary">{option.label}</span>
                  <span className="block truncate text-caption text-text-muted">{option.category}</span>
                </span>
              </button>
            ))}
            {filtered.length === 0 ? (
              <p className="px-2.5 py-4 text-center text-sm text-text-muted">No tools match &ldquo;{query}&rdquo;.</p>
            ) : null}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className="platform-input flex cursor-pointer items-center gap-3 px-4 py-3 text-left transition hover:bg-brand-cyan/8"
        >
          {selected ? (
            <>
              <FaviconBadge
                name={selected.label}
                faviconUrl={selected.favicon}
                className="h-8 w-8 shrink-0 rounded-xl"
                imgClassName="p-1"
                labelClassName="text-xs"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-text-primary">{selected.label}</span>
                <span className="block truncate text-caption text-text-muted">{selected.category}</span>
              </span>
            </>
          ) : (
            <span className="flex-1 text-sm text-text-muted">Select a tool...</span>
          )}
          <span aria-hidden className="shrink-0 text-text-muted">
            ▾
          </span>
        </button>
      )}
    </div>
  );
}

export function CompareSelector({
  currentLeft,
  currentRight,
  toolOptions,
}: {
  currentLeft: string;
  currentRight: string;
  toolOptions: ToolOption[];
}) {
  const router = useRouter();
  const [left, setLeft] = useState(currentLeft);
  const [right, setRight] = useState(currentRight);

  function handleCompare() {
    if (left && right && left !== right) {
      router.push(`/compare?leftId=${encodeURIComponent(left)}&rightId=${encodeURIComponent(right)}`);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <ToolCombobox label="Tool A" value={left} onChange={setLeft} options={toolOptions} excludeValue={right} />

      <span
        aria-hidden
        className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-accent bg-surface-3 text-xs font-bold text-brand-cyan-strong sm:mb-3"
      >
        VS
      </span>

      <ToolCombobox label="Tool B" value={right} onChange={setRight} options={toolOptions} excludeValue={left} />

      <Button
        onClick={handleCompare}
        disabled={!left || !right || left === right}
        size="lg"
        className="shrink-0 disabled:cursor-not-allowed disabled:opacity-40 sm:mb-0"
      >
        Compare
      </Button>
    </div>
  );
}
