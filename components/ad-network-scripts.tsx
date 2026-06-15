import Script from "next/script";

import { adPlacements, adsEnabled } from "@/lib/ads";

const globalScriptPlacements = [
  adPlacements.popunder,
  adPlacements.socialBar,
].filter((placement) => placement.enabled && placement.scriptUrl);

export function AdNetworkScripts() {
  if (!adsEnabled || globalScriptPlacements.length === 0) {
    return null;
  }

  return (
    <>
      {globalScriptPlacements.map((placement) => (
        <Script
          data-ad-zone-id={placement.id}
          data-ad-zone-name={placement.name}
          id={`ad-${placement.id}`}
          key={placement.id}
          src={placement.scriptUrl}
          strategy="afterInteractive"
        />
      ))}
    </>
  );
}
