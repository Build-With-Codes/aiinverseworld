export type AdPlacementKey =
  | "popunder"
  | "socialBar"
  | "nativeBanner"
  | "smartlink"
  | "banner468x60";

export type AdPlacement = {
  id: string;
  name: string;
  type: string;
  scriptUrl?: string;
  href?: string;
  containerId?: string;
  key?: string;
  width?: number;
  height?: number;
};

export const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED !== "false";

export const adPlacements: Record<AdPlacementKey, AdPlacement> = {
  popunder: {
    id: "29648335",
    name: "Popunder_1",
    type: "Popunder",
    scriptUrl: process.env.NEXT_PUBLIC_AD_POPUNDER_SCRIPT_URL,
  },
  socialBar: {
    id: "29648336",
    name: "SocialBar_1",
    type: "Social Bar",
    scriptUrl: process.env.NEXT_PUBLIC_AD_SOCIAL_BAR_SCRIPT_URL,
  },
  nativeBanner: {
    id: "29648337",
    name: "NativeBanner_1",
    type: "Native Banner",
    scriptUrl: process.env.NEXT_PUBLIC_AD_NATIVE_BANNER_SCRIPT_URL,
    containerId: process.env.NEXT_PUBLIC_AD_NATIVE_BANNER_CONTAINER_ID,
  },
  smartlink: {
    id: "29648354",
    name: "Smartlink_1",
    type: "Smartlink",
    href: process.env.NEXT_PUBLIC_AD_SMARTLINK_URL,
  },
  banner468x60: {
    id: "29648355",
    name: "Banner_468x60",
    type: "Banner 468x60",
    scriptUrl: process.env.NEXT_PUBLIC_AD_BANNER_468_SCRIPT_URL,
    key: process.env.NEXT_PUBLIC_AD_BANNER_468_KEY,
    width: 468,
    height: 60,
  },
};
