import Script from "next/script";

import { type AdPlacementKey, adPlacements, adsEnabled } from "@/lib/ads";

type AdSlotProps = {
  placement: Extract<AdPlacementKey, "nativeBanner" | "banner468x60">;
  className?: string;
};

export function AdSlot({ placement, className = "" }: AdSlotProps) {
  const ad = adPlacements[placement];

  if (!adsEnabled || !ad.enabled || !ad.scriptUrl) {
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
        id={ad.containerId ?? `ad-container-${ad.id}`}
        style={{
          minHeight: ad.height,
          width: ad.width ? `${ad.width}px` : undefined,
        }}
      />
      {placement === "banner468x60" && ad.key ? (
        <Script id={`ad-options-${ad.id}`} strategy="afterInteractive">
          {`
            window.atOptions = {
              key: "${ad.key}",
              format: "iframe",
              height: ${ad.height ?? 60},
              width: ${ad.width ?? 468},
              params: {}
            };
          `}
        </Script>
      ) : null}
      <Script
        data-ad-zone-id={ad.id}
        id={`ad-slot-script-${ad.id}`}
        src={ad.scriptUrl}
        strategy="afterInteractive"
      />
    </aside>
  );
}
