"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ToolOption = {
  value: string;
  slug: string;
  label: string;
};

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
      <div className="flex-1 space-y-2">
        <label className="text-xs font-semibold tracking-widest text-text-muted uppercase">Tool A</label>
        <select
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          className="w-full rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-slate-200 outline-none focus:border-border-accent"
        >
          {toolOptions.map((o) => (
            <option key={o.value} value={o.value} disabled={o.value === right}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <span className="shrink-0 text-center text-text-muted font-semibold sm:pb-3">vs</span>

      <div className="flex-1 space-y-2">
        <label className="text-xs font-semibold tracking-widest text-text-muted uppercase">Tool B</label>
        <select
          value={right}
          onChange={(e) => setRight(e.target.value)}
          className="w-full rounded-2xl border border-border-subtle bg-surface-1 px-4 py-3 text-sm text-slate-200 outline-none focus:border-border-accent"
        >
          {toolOptions.map((o) => (
            <option key={o.value} value={o.value} disabled={o.value === left}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleCompare}
        disabled={!left || !right || left === right}
        className="shrink-0 rounded-4xl bg-[var(--button-primary-bg)] px-6 py-3 text-sm font-semibold text-[var(--button-primary-text)] transition hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 sm:mb-0"
 >
        Compare
      </button>
    </div>
  );
}
