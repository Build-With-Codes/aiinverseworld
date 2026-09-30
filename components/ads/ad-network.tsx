import { AD_CREATIVE, FORMAT_SIZE } from "@/lib/ads/config";
import type { AdFormat } from "@/lib/ads/types";
import { AdFrame } from "@/components/ads/ad-frame";

/** Renders one ad unit for one format. The creative file behind AD_CREATIVE
 * is the only place the actual ad-network script lives — see public/creative. */
export function AdNetwork({ format, className }: { format: AdFormat; className?: string }) {
  const src = AD_CREATIVE[format];
  const size = FORMAT_SIZE[format];
  return <AdFrame src={src} width={size.width} height={size.height} className={className} />;
}
