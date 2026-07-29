import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import { authOptions } from "@/auth";
import { ChatSupportGate } from "@/components/chat-support-gate";
import { ConsentedAnalytics } from "@/components/consented-analytics";
import { ConsentedScript } from "@/components/consented-script";
import { ConsentMode } from "@/components/consent-mode";
import { CookieConsent } from "@/components/cookie-consent";
import { CompareBar } from "@/components/engagement/compare-tray";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/site-shell";
import { googleAuthEnabled } from "@/lib/auth-config";
import { siteUrl } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildGlobalStructuredData, jsonLd } from "@/lib/structured-data";
import { getRouteSeo } from "@/services/seo.service";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import Script from "next/script";

import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body-sans",
  display: "swap",
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display-sans",
  display: "swap",
});

const rootMetadata = buildMetadata(getRouteSeo("/"));
const ezoicEnabled = process.env.NEXT_PUBLIC_EZOIC_ENABLED === "true";

export const metadata: Metadata = {
  ...rootMetadata,
  metadataBase: new URL(siteUrl),
  title: {
    default: String(rootMetadata.title ?? "AiverseWorld"),
    template: "%s",
  },
  openGraph: rootMetadata.openGraph
    ? {
        ...rootMetadata.openGraph,
        siteName: "AiverseWorld",
        type: "website",
      }
    : undefined,
  twitter: {
    ...rootMetadata.twitter,
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, requestHeaders] = await Promise.all([getServerSession(authOptions), headers()]);
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  const isAdminSection = requestHeaders.get("x-route-section") === "admin";
  const structuredData = buildGlobalStructuredData();

  return (
    <html
      lang="en"
      className={`h-full antialiased ${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {!isAdminSection && ezoicEnabled ? (
          <>
            <Script
              id="ezoic-cmp"
              data-cfasync="false"
              src="https://cmp.gatekeeperconsent.com/min.js"
              strategy="beforeInteractive"
            />
            <Script
              id="ezoic-gatekeeper-cmp"
              data-cfasync="false"
              src="https://the.gatekeeperconsent.com/cmp.min.js"
              strategy="beforeInteractive"
            />
            <Script
              id="ezoic-header"
              async
              src="https://www.ezojs.com/ezoic/sa.min.js"
              strategy="beforeInteractive"
            />
            <Script
              id="ezoic-standalone-init"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.ezstandalone = window.ezstandalone || {};
                  window.ezstandalone.cmd = window.ezstandalone.cmd || [];
                `,
              }}
            />
            <Script
              id="ezoic-analytics"
              src="https://ezoicanalytics.com/analytics.js"
              strategy="beforeInteractive"
            />
          </>
        ) : null}
        <script
          id="theme-init"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const stored = window.localStorage.getItem("aiverse-theme");
                const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                const theme = stored === "light" || stored === "dark" ? stored : systemDark ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", theme);
              })();
            `,
          }}
        />
        <ConsentMode nonce={nonce} />
        <script
          id="aiverseworld-global-schema"
          nonce={nonce}
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
        />
        {/* REMOVED: Next.js <Script> component and invalid meta tags are removed from <head> */}
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        {isAdminSection ? (
          <Providers session={session}>{children}</Providers>
        ) : (
          <>
            <Providers session={session}>
              <SiteShell>{children}</SiteShell>
              <CompareBar />
            </Providers>
            <CookieConsent />
            {session?.user ? (
              <ConsentedScript id="chatbase-widget" nonce={nonce}>
                {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="oqIeeF-NRJYMKRywqI8DE";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
              </ConsentedScript>
            ) : (
              <ChatSupportGate enabled={googleAuthEnabled} />
            )}
            <ConsentedAnalytics />
          </>
        )}
      </body>
    </html>
  );
}
