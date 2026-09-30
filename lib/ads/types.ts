/** Every ad size actually served on this site. */
export type AdFormat = "728x90" | "468x60" | "320x50" | "300x250" | "160x300" | "native";

/**
 * Every place in the app that can show an ad. Pages/layouts request one of
 * these — never a raw ad-network component — via `<AdSlot placement="..." />`.
 */
export type AdPlacementId =
  | "site-top"
  | "site-bottom"
  | "tool-mid"
  | "blog-mid"
  | "category-mid"
  | "search-mid";

export interface AdPlacementFormats {
  desktop: AdFormat;
  /** `null` means this placement never renders below the desktop breakpoint. */
  mobile: AdFormat | null;
}
