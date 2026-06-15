import Script from "next/script";

import { type AdPlacementKey, adPlacements, adsEnabled } from "@/lib/ads";

type AdSlotProps = {
  placement: Extract<AdPlacementKey, "nativeBanner" | "banner468x60">;
  className?: string;
};

export function AdSlot({ placement, className = "" }: AdSlotProps) {
  const ad = adPlacements[placement];

  if (!adsEnabled || !ad.scriptUrl) {
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      className={`ad-slot ad-slot-${placement} ${className}`}
      data-ad-zone-id={ad.id}
      data-ad-zone-name={ad.name}
      data-ad-zone-type={ad.type}
      style={{
        minHeight: ad.height,
        maxWidth: ad.width,
      }}
    >
      <div
        className="ad-slot-frame"
        id={`ad-container-${ad.id}`}
        style={{
          minHeight: ad.height,
          width: ad.width ? `${ad.width}px` : undefined,
        }}
      />
      <Script
        data-ad-zone-id={ad.id}
        id={`ad-slot-script-${ad.id}`}
        src={ad.scriptUrl}
        strategy="afterInteractive"
      />
    </aside>
  );
}
