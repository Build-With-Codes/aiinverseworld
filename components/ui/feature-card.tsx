import type { ReactNode } from "react";

import { cardClass } from "@/components/ui/card";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  benefit?: string;
};

export function FeatureCard({ icon, title, description, benefit }: FeatureCardProps) {
  return (
    <div className={cardClass({ hover: true })}>
      <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-gradient-to-br from-brand-electric/16 to-brand-violet/12 text-lg text-brand-electric-strong">
        {icon}
      </div>
      <h3 className="text-heading-2 mt-4 text-text-primary">{title}</h3>
      <p className="text-body mt-2 text-text-secondary">{description}</p>
      {benefit ? (
        <p className="text-caption mt-3 flex items-start gap-2 text-brand-electric-strong">
          <span aria-hidden>→</span>
          <span>{benefit}</span>
        </p>
      ) : null}
    </div>
  );
}
