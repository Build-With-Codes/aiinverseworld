"use client";

import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  parseConsent,
  subscribeToConsent,
} from "@/components/cookie-consent";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";

type GoogleAnalyticsProps = {
  gaId?: string;
};

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consentSnapshot = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const consent = useMemo(() => parseConsent(consentSnapshot), [consentSnapshot]);
  const pagePath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);
  const previousPagePath = useRef(pagePath);
  const previousAnalyticsConsent = useRef(Boolean(consent?.analytics));

  useEffect(() => {
    const analyticsAllowed = Boolean(consent?.analytics);
    const consentJustGranted = !previousAnalyticsConsent.current && analyticsAllowed;
    const pathChanged = previousPagePath.current !== pagePath;

    if (!gaId || !analyticsAllowed || typeof window.gtag !== "function") {
      previousAnalyticsConsent.current = analyticsAllowed;
      previousPagePath.current = pagePath;
      return;
    }

    if (consentJustGranted || pathChanged) {
      window.gtag("config", gaId, {
        page_path: pagePath,
        anonymize_ip: true,
      });
    }

    previousAnalyticsConsent.current = analyticsAllowed;
    previousPagePath.current = pagePath;
  }, [consent?.analytics, gaId, pagePath]);

  return null;
}
