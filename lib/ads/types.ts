/** Every ad size actually served on this site. */
export type AdFormat = "728x90" | "468x60" | "320x50" | "300x250" | "160x300" | "native";

/**
 * Every place in the app that can show an ad. Pages/layouts request one of
 * these — never a raw ad-network component — via `<AdSlot placement="..." />`.
 */
export type AdPlacementId =
  | "site-bottom"
  | "home-mid"
  | "home-lower"
  | "tool-mid"
  | "tool-lower"
  | "blog-mid"
  | "blog-lower"
  | "category-mid"
  | "category-lower"
  | "search-mid"
  | "search-lower"
  | "compare-mid"
  | "compare-lower"
  | "news-mid"
  | "news-lower"
  | "trending-mid"
  | "trending-lower"
  | "jobs-mid"
  | "jobs-lower"
  | "best-mid"
  | "best-lower"
  | "collections-mid"
  | "collection-mid"
  | "collection-lower"
  | "prompts-mid"
  | "prompts-lower"
  | "prompt-detail-mid"
  | "problems-mid"
  | "problems-lower"
  | "blog-index-mid"
  | "compare-index-mid"
  | "compare-index-lower";

export interface AdPlacementFormats {
  desktop: AdFormat;
  /** `null` means this placement never renders below the desktop breakpoint. */
  mobile: AdFormat | null;
}
