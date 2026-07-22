"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

export const cookieConsentStorageKey = "aiverseworld-cookie-consent";
export const cookieConsentChangeEvent = "aiverseworld-cookie-consent-change";

export type CookieConsentChoice = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export function CookieConsent() {
  const consentSnapshot = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);
  const consent = useMemo(() => parseConsent(consentSnapshot), [consentSnapshot]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const visible = consent === null;

  function saveConsent(choice: Omit<CookieConsentChoice, "necessary" | "updatedAt">) {
    window.localStorage.setItem(
      cookieConsentStorageKey,
      JSON.stringify({
        necessary: true,
        analytics: choice.analytics,
        marketing: choice.marketing,
        updatedAt: new Date().toISOString(),
      } satisfies CookieConsentChoice),
    );
    window.dispatchEvent(new Event(cookieConsentChangeEvent));
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="app-glass mx-auto flex max-w-5xl flex-col gap-4 rounded-[28px] border border-white/10 bg-[#071120]/95 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-white">Cookie consent</p>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            We use necessary cookies to run the site. With your permission, we also use analytics and advertising cookies to measure performance and support personalized ads.
            Review our{" "}
            <Link href="/cookie-policy" className="font-semibold text-cyan-200 hover:text-cyan-100">
              Cookie Policy
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold text-cyan-200 hover:text-cyan-100">
              Privacy Policy
            </Link>
            .
          </p>
          {showPreferences ? (
            <div className="mt-4 grid gap-3 text-sm text-slate-200 sm:grid-cols-3">
              <label className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="block font-semibold text-white">Necessary</span>
                <span className="mt-1 block text-xs leading-5 text-slate-400">Always on for security and core site features.</span>
              </label>
              <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="flex items-center gap-2 font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) => setAnalytics(event.target.checked)}
                  />
                  Analytics
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-400">Helps us understand performance and improve pages.</span>
              </label>
              <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="flex items-center gap-2 font-semibold text-white">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(event) => setMarketing(event.target.checked)}
                  />
                  Ads
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-400">Allows advertising cookies, including personalized ads where available.</span>
              </label>
            </div>
          ) : null}
        </div>
        <div className="grid shrink-0 gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => saveConsent({ analytics: true, marketing: true })}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => saveConsent({ analytics: false, marketing: false })}
            className="rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-300/30 hover:text-white"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() =>
              showPreferences
                ? saveConsent({ analytics, marketing })
                : setShowPreferences(true)
            }
            className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-center text-sm font-semibold text-cyan-100 hover:bg-cyan-300/15"
          >
            {showPreferences ? "Save" : "Manage"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(cookieConsentChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(cookieConsentChangeEvent, onStoreChange);
  };
}

export function getConsentSnapshot() {
  return window.localStorage.getItem(cookieConsentStorageKey) ?? "";
}

export function getServerConsentSnapshot() {
  return "";
}

export function parseConsent(stored: string): CookieConsentChoice | null {
  if (!stored) {
    return null;
  }

  if (stored === "accepted") {
    return {
      necessary: true,
      analytics: true,
      marketing: true,
      updatedAt: new Date(0).toISOString(),
    };
  }

  try {
    const parsed = JSON.parse(stored) as Partial<CookieConsentChoice>;

    return {
      necessary: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}
