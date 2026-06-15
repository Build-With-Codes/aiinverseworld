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
  enabled: boolean;
  scriptUrl?: string;
  href?: string;
  containerId?: string;
  key?: string;
  width?: number;
  height?: number;
};

function isEnabled(value: string | undefined, defaultValue = true) {
  if (!value) {
    return defaultValue;
  }

  return !["0", "false", "off", "no"].includes(value.toLowerCase());
}

export const adsEnabled = isEnabled(process.env.NEXT_PUBLIC_ADS_ENABLED);

export const adPlacements: Record<AdPlacementKey, AdPlacement> = {
  popunder: {
    id: "29648335",
    name: "Popunder_1",
    type: "Popunder",
    enabled: isEnabled(process.env.NEXT_PUBLIC_AD_POPUNDER_ENABLED),
    scriptUrl: process.env.NEXT_PUBLIC_AD_POPUNDER_SCRIPT_URL,
  },
  socialBar: {
    id: "29648336",
    name: "SocialBar_1",
    type: "Social Bar",
    enabled: isEnabled(process.env.NEXT_PUBLIC_AD_SOCIAL_BAR_ENABLED),
    scriptUrl: process.env.NEXT_PUBLIC_AD_SOCIAL_BAR_SCRIPT_URL,
  },
  nativeBanner: {
    id: "29648337",
    name: "NativeBanner_1",
    type: "Native Banner",
    enabled: isEnabled(process.env.NEXT_PUBLIC_AD_NATIVE_BANNER_ENABLED),
    scriptUrl: process.env.NEXT_PUBLIC_AD_NATIVE_BANNER_SCRIPT_URL,
    containerId: process.env.NEXT_PUBLIC_AD_NATIVE_BANNER_CONTAINER_ID,
  },
  smartlink: {
    id: "29648354",
    name: "Smartlink_1",
    type: "Smartlink",
    enabled: isEnabled(process.env.NEXT_PUBLIC_AD_SMARTLINK_ENABLED),
    href: process.env.NEXT_PUBLIC_AD_SMARTLINK_URL,
  },
  banner468x60: {
    id: "29648355",
    name: "Banner_468x60",
    type: "Banner 468x60",
    enabled: isEnabled(process.env.NEXT_PUBLIC_AD_BANNER_468_ENABLED),
    scriptUrl: process.env.NEXT_PUBLIC_AD_BANNER_468_SCRIPT_URL,
    key: process.env.NEXT_PUBLIC_AD_BANNER_468_KEY,
    width: 468,
    height: 60,
  },
};
