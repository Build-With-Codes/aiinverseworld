type AnalyticsEventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "event" | "js",
      targetIdOrEventName: string | Date,
      params?: AnalyticsEventParams,
    ) => void;
  }
}

export function trackEvent(name: string, params?: AnalyticsEventParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", name, params);
}

export {};
