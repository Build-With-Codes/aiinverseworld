"use client";

import Script from "next/script";

type EzoicAdPlacementProps = {
  id: string;
  className?: string;
};

const ezoicEnabled = process.env.NEXT_PUBLIC_EZOIC_ENABLED === "true";

export function EzoicAdPlacement({ id, className }: EzoicAdPlacementProps) {
  if (!ezoicEnabled) {
    return null;
  }

  return (
    <div className={className ?? "ad-slot"} aria-label="Advertisement">
      <Script id={`ezoic-ad-${id}`} strategy="afterInteractive">
        {`
          window.ezstandalone = window.ezstandalone || {};
          window.ezstandalone.cmd = window.ezstandalone.cmd || [];
          window.ezstandalone.cmd.push(function () {
            window.ezstandalone.showAds({});
          });
        `}
      </Script>
    </div>
  );
}
