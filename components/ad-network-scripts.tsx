import { ConsentedScript } from "@/components/consented-script";
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
        <ConsentedScript
          dataAttributes={{
            "ad-zone-id": placement.id,
            "ad-zone-name": placement.name,
          }}
          id={`ad-${placement.id}`}
          key={placement.id}
          src={placement.scriptUrl}
        />
      ))}
    </>
  );
}
