"use client";

import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  parseConsent,
  subscribeToConsent,
} from "@/components/cookie-consent";
import Script from "next/script";
import { useMemo, useSyncExternalStore } from "react";

type ConsentedScriptProps = {
  id: string;
  src?: string;
  children?: string;
  crossOrigin?: "anonymous" | "use-credentials";
  async?: boolean;
  dataAttributes?: Record<string, string>;
};

export function ConsentedScript({
  id,
  src,
  children,
  crossOrigin,
  async,
  dataAttributes,
}: ConsentedScriptProps) {
  const consentSnapshot = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);
  const consent = useMemo(() => parseConsent(consentSnapshot), [consentSnapshot]);

  if (!consent?.marketing) {
    return null;
  }

  return (
    <Script
      {...toDataAttributes(dataAttributes)}
      id={id}
      src={src}
      crossOrigin={crossOrigin}
      async={async}
      strategy="afterInteractive"
    >
      {children}
    </Script>
  );
}

function toDataAttributes(dataAttributes?: Record<string, string>) {
  if (!dataAttributes) {
    return {};
  }

  return Object.fromEntries(Object.entries(dataAttributes).map(([key, value]) => [`data-${key}`, value]));
}
