"use client";

import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  parseConsent,
  subscribeToConsent,
} from "@/components/cookie-consent";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useMemo, useSyncExternalStore } from "react";

type GoogleAnalyticsProps = {
  gaId?: string;
  nonce?: string;
};

export function GoogleAnalytics({ gaId, nonce }: GoogleAnalyticsProps) {
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

  useEffect(() => {
    if (!gaId || !consent?.analytics || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("config", gaId, {
      page_path: pagePath,
      anonymize_ip: true,
    });
  }, [consent?.analytics, gaId, pagePath]);

  if (!gaId || !consent?.analytics) {
    return null;
  }

  return (
    <>
      <Script
        id="google-analytics-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        nonce={nonce}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-config" nonce={nonce} strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}
          window.gtag("js", new Date());
          window.gtag("config", "${gaId}", {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
