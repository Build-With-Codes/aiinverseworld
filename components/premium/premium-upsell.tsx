import Link from "next/link";

type PremiumUpsellProps = {
  headline: string;
  sub?: string;
  cta?: string;
};

/**
 * Contextual, non-intrusive upsell. Meant to appear exactly at a moment of
 * intent (a hit compare/save cap, a gated collection) — never as a banner.
 */
export function PremiumUpsell({
  headline,
  sub = "Unlock unlimited compares & saves, ad-free reading, and members-only deep dives.",
  cta = "See Premium",
}: PremiumUpsellProps) {
  return (
    <div className="relative overflow-hidden rounded-card border border-border-accent bg-gradient-to-br from-brand-electric/10 via-brand-violet/8 to-transparent p-5 shadow-glow-violet">
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-brand-violet/20 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-semibold text-text-primary">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-brand-violet-strong" aria-hidden>
              <path
                d="M3 7l3.2 2.2L10 4l3.8 5.2L17 7l-1.3 8.2a1 1 0 0 1-1 .8H5.3a1 1 0 0 1-1-.8L3 7Z"
                fill="currentColor"
              />
            </svg>
            {headline}
          </p>
          <p className="text-body mt-1 text-text-secondary">{sub}</p>
        </div>
        <Link
          href="/premium"
          className="premium-pill premium-gradient inline-flex shrink-0 items-center gap-1.5 rounded-pill px-5 py-2.5 text-sm font-semibold"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
