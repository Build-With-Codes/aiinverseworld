import { Suspense } from "react";

import { ChatWidgetGate } from "@/components/chat-widget-gate";
import { ConsentedAnalytics } from "@/components/consented-analytics";
import { ConsentedScript } from "@/components/consented-script";
import { CookieConsent } from "@/components/cookie-consent";
import { CompareBar } from "@/components/engagement/compare-tray";
import { GoogleAnalytics } from "@/components/google-analytics";
import { SiteShell } from "@/components/site-shell";
import { googleAuthEnabled } from "@/lib/auth-config";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-8RHHLW4YVF";

/**
 * Public-site layout — a plain, ordinary Server Component. This is the
 * whole point of the route-group split: it renders SiteShell directly
 * (never through a Client Component boundary, which is what silently
 * suppressed real HTML in two earlier attempts), and it never calls
 * headers()/getServerSession() itself, so pages under this group are free
 * to be static/ISR per their own `revalidate` export. The admin/public
 * split is resolved by the file system now (this group vs. app/admin/),
 * not by a runtime pathname check — so there's no client-side branching
 * logic here at all needed to keep admin out of this shell.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsentedScript
        async
        id="google-adsense"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1921034562411070"
        crossOrigin="anonymous"
      />
      <SiteShell>{children}</SiteShell>
      <CompareBar />
      <CookieConsent />
      <ChatWidgetGate enabled={googleAuthEnabled} />
      <ConsentedAnalytics />
      <Suspense fallback={null}>
        <GoogleAnalytics gaId={gaMeasurementId} />
      </Suspense>
    </>
  );
}
