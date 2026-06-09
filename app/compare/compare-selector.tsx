"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { aiTools } from "@/lib/site-data";

export function CompareSelector({ currentLeft, currentRight }: { currentLeft: string; currentRight: string }) {
  const router = useRouter();
  const [left, setLeft] = useState(currentLeft);
  const [right, setRight] = useState(currentRight);

  const toolOptions = aiTools.map((t) => ({ value: t.slug, label: t.name }));

  function handleCompare() {
    if (left && right && left !== right) {
      router.push(`/compare/${left}-vs-${right}`);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-2">
        <label className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Tool A</label>
        <select
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#071120] px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-300/30"
        >
          {toolOptions.map((o) => (
            <option key={o.value} value={o.value} disabled={o.value === right}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <span className="shrink-0 text-center text-slate-500 font-semibold sm:pb-3">vs</span>

      <div className="flex-1 space-y-2">
        <label className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Tool B</label>
        <select
          value={right}
          onChange={(e) => setRight(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#071120] px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-300/30"
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
        className="shrink-0 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Compare →
      </button>
    </div>
  );
}
