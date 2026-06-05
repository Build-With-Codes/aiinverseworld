import type { ReactNode } from "react";

type ThemeName =
  | "company"
  | "privacy"
  | "legal"
  | "security"
  | "contact"
  | "monetization";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  theme?: ThemeName;
  highlights?: string[];
  children: ReactNode;
};

const themeStyles: Record<
  ThemeName,
  {
    shell: string;
    badge: string;
    hero: string;
    panel: string;
  }
> = {
  company: {
    shell:
      "bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_28%)]",
    badge: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
    hero:
      "border-cyan-300/14 bg-linear-to-br from-cyan-400/12 via-blue-500/8 to-transparent",
    panel:
      "border-cyan-300/10 bg-linear-to-br from-[#081626] to-[#091120]",
  },
  privacy: {
    shell:
      "bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(20,184,166,0.14),_transparent_28%)]",
    badge: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
    hero:
      "border-emerald-300/14 bg-linear-to-br from-emerald-400/12 via-teal-500/8 to-transparent",
    panel:
      "border-emerald-300/10 bg-linear-to-br from-[#07161b] to-[#08121a]",
  },
  legal: {
    shell:
      "bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.12),_transparent_28%)]",
    badge: "border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-200",
    hero:
      "border-fuchsia-300/14 bg-linear-to-br from-fuchsia-400/12 via-violet-500/8 to-transparent",
    panel:
      "border-fuchsia-300/10 bg-linear-to-br from-[#151021] to-[#0a101c]",
  },
  security: {
    shell:
      "bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.14),_transparent_28%)]",
    badge: "border-blue-300/20 bg-blue-300/10 text-blue-200",
    hero:
      "border-blue-300/14 bg-linear-to-br from-blue-400/12 via-indigo-500/8 to-transparent",
    panel:
      "border-blue-300/10 bg-linear-to-br from-[#071524] to-[#08111d]",
  },
  contact: {
    shell:
      "bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.10),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_28%)]",
    badge: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    hero:
      "border-amber-300/14 bg-linear-to-br from-amber-400/12 via-orange-500/8 to-transparent",
    panel:
      "border-amber-300/10 bg-linear-to-br from-[#1a1207] to-[#0d1018]",
  },
  monetization: {
    shell:
      "bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.12),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(217,119,6,0.14),_transparent_28%)]",
    badge: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    hero:
      "border-amber-300/14 bg-linear-to-br from-amber-400/12 via-orange-500/8 to-transparent",
    panel:
      "border-amber-300/10 bg-linear-to-br from-[#171106] to-[#0d1118]",
  },
};

export function ContentPage({
  eyebrow,
  title,
  description,
  theme = "company",
  highlights = [],
  children,
}: ContentPageProps) {
  const styles = themeStyles[theme];

  return (
    <div className={`space-y-10 pb-10 pt-10 ${styles.shell}`}>
      <section className={`rounded-[34px] border bg-white/6 p-8 ${styles.hero}`}>
        <span
          className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold tracking-[0.28em] uppercase ${styles.badge}`}
        >
          {eyebrow}
        </span>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              {description}
            </p>
          </div>
          <div className={`rounded-[28px] border p-6 ${styles.panel}`}>
            <p className="text-sm font-medium text-white">Why this matters</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {highlights.length > 0 ? (
                highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-200"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-slate-200">
                  Enterprise-ready
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] border border-white/10 bg-white/6 p-8">
        <div className="content-page-copy space-y-8">{children}</div>
      </section>
    </div>
  );
}
