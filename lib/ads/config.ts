import type { AdFormat, AdPlacementFormats, AdPlacementId } from "@/lib/ads/types";

/**
 * Every ad placement in the app and the format it uses per breakpoint.
 * `mobile: null` means the placement never renders below the desktop
 * breakpoint.
 */
export const AD_PLACEMENTS: Record<AdPlacementId, AdPlacementFormats> = {
  "site-bottom": { desktop: "300x250", mobile: "300x250" },
  "home-mid": { desktop: "728x90", mobile: "320x50" },
  "home-lower": { desktop: "300x250", mobile: "300x250" },
  "tool-mid": { desktop: "native", mobile: "native" },
  "tool-lower": { desktop: "300x250", mobile: "300x250" },
  "blog-mid": { desktop: "native", mobile: "native" },
  "blog-lower": { desktop: "300x250", mobile: "300x250" },
  "category-mid": { desktop: "728x90", mobile: "320x50" },
  "category-lower": { desktop: "300x250", mobile: "300x250" },
  "search-mid": { desktop: "160x300", mobile: "300x250" },
  "search-lower": { desktop: "728x90", mobile: "320x50" },
  "compare-mid": { desktop: "300x250", mobile: "300x250" },
  "compare-lower": { desktop: "728x90", mobile: "320x50" },
  "news-mid": { desktop: "728x90", mobile: "320x50" },
  "news-lower": { desktop: "300x250", mobile: "300x250" },
  "trending-mid": { desktop: "728x90", mobile: "320x50" },
  "trending-lower": { desktop: "300x250", mobile: "300x250" },
  "jobs-mid": { desktop: "300x250", mobile: "300x250" },
  "jobs-lower": { desktop: "728x90", mobile: "320x50" },
  "best-mid": { desktop: "728x90", mobile: "320x50" },
  "best-lower": { desktop: "300x250", mobile: "300x250" },
  "collections-mid": { desktop: "728x90", mobile: "320x50" },
  "collection-mid": { desktop: "728x90", mobile: "320x50" },
  "collection-lower": { desktop: "300x250", mobile: "300x250" },
  "prompts-mid": { desktop: "300x250", mobile: "300x250" },
  "prompts-lower": { desktop: "728x90", mobile: "320x50" },
  "prompt-detail-mid": { desktop: "300x250", mobile: "300x250" },
  "problems-mid": { desktop: "300x250", mobile: "300x250" },
  "problems-lower": { desktop: "728x90", mobile: "320x50" },
  "blog-index-mid": { desktop: "728x90", mobile: "320x50" },
  "compare-index-mid": { desktop: "728x90", mobile: "320x50" },
  "compare-index-lower": { desktop: "300x250", mobile: "300x250" },
};

/**
 * One static ad-network creative file (public/creative/*.html) per format —
 * see that folder for the actual network script embedded per unit. This
 * folder is deliberately NOT named "ads" — generic ad-blocker filter lists
 * (EasyList and similar) block any URL path containing "/ads/" regardless of
 * domain, which silently blocks same-origin, first-party static files too.
 */
export const AD_CREATIVE: Record<AdFormat, string> = {
  "728x90": "/creative/leaderboard-728x90.html",
  "468x60": "/creative/banner-468x60.html",
  "320x50": "/creative/mobile-320x50.html",
  "300x250": "/creative/rectangle-300x250.html",
  "160x300": "/creative/rectangle-160x300.html",
  native: "/creative/native-banner.html",
};

/** Pixel dimensions per format — used to reserve layout space before load. Native
 * banners are responsive-height; this is a reasonable reserved footprint, not
 * a hard size the network is constrained to. */
export const FORMAT_SIZE: Record<AdFormat, { width: number | string; height: number }> = {
  "728x90": { width: 728, height: 90 },
  "468x60": { width: 468, height: 60 },
  "320x50": { width: 320, height: 50 },
  "300x250": { width: 300, height: 250 },
  "160x300": { width: 160, height: 300 },
  native: { width: "100%", height: 300 },
};
