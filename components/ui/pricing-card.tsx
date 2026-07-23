import { Button } from "@/components/ui/button";
import { cardClass } from "@/components/ui/card";

type PricingCardProps = {
  planName: string;
  price: string;
  cadence?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

export function PricingCard({
  planName,
  price,
  cadence = "/mo",
  description,
  features,
  highlighted = false,
  ctaLabel = "Get started",
  ctaHref,
}: PricingCardProps) {
  return (
    <div
      className={`${cardClass({ hover: true, glow: highlighted ? "cyan" : "none", padding: "lg" })} ${
        highlighted ? "border-border-accent" : ""
      }`}
    >
      <p className="text-eyebrow text-brand-cyan-strong">{planName}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-display-2 text-text-primary">{price}</span>
        {price !== "Free" ? <span className="text-caption text-text-muted">{cadence}</span> : null}
      </p>
      {description ? <p className="text-body mt-2 text-text-secondary">{description}</p> : null}
      <ul className="mt-5 space-y-2.5">
        {features.map((feature) => (
          <li key={feature} className="text-body flex items-start gap-2 text-text-secondary">
            <span className="mt-0.5 text-brand-cyan-strong" aria-hidden>
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {ctaHref ? (
        <Button href={ctaHref} variant={highlighted ? "primary" : "secondary"} className="mt-6 w-full">
          {ctaLabel}
        </Button>
      ) : null}
    </div>
  );
}
