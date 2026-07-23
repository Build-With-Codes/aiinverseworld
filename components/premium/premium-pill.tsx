import Link from "next/link";

type PremiumPillProps = {
  size?: "sm" | "md";
  className?: string;
  label?: string;
};

/**
 * The single, persistent Premium anchor. Uses the brand gradient with a
 * subtle shimmer + glow so it reads as the product's own best surface — not an
 * ad. Reduced-motion disables the shimmer (see globals.css).
 */
export function PremiumPill({ size = "sm", className = "", label = "Premium" }: PremiumPillProps) {
  const sizing = size === "md" ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-sm";

  return (
    <Link
      href="/premium"
      className={`premium-pill premium-gradient inline-flex cursor-pointer items-center gap-1.5 rounded-pill font-semibold transition ${sizing} ${className}`}
    >
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
        <path
          d="M3 7l3.2 2.2L10 4l3.8 5.2L17 7l-1.3 8.2a1 1 0 0 1-1 .8H5.3a1 1 0 0 1-1-.8L3 7Z"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
