import type { Metadata } from "next";
import Script from "next/script";

import { authOptions } from "@/auth";
import { AdNetworkScripts } from "@/components/ad-network-scripts";
import { ChatSupportGate } from "@/components/chat-support-gate";
import { ConsentedScript } from "@/components/consented-script";
import { ConsentMode } from "@/components/consent-mode";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteShell } from "@/components/site-shell";
import { googleAuthEnabled } from "@/lib/auth-config";
import { buildUrl, defaultOpenGraphImage, siteUrl } from "@/lib/seo";
import { buildGlobalStructuredData, jsonLd } from "@/lib/structured-data";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AiverseWorld | Discover the Perfect AI Tool",
    template: "%s",
  },
  description:
    "Discover, compare, and shortlist AI tools across writing, coding, video, research, and productivity.",
  alternates: {
    canonical: buildUrl("/"),
  },
  openGraph: {
    title: "AiverseWorld",
    description:
      "Enterprise-grade AI tool discovery with search, comparisons, ratings, and curated categories.",
    url: siteUrl,
    siteName: "AiverseWorld",
    type: "website",
    images: [
      defaultOpenGraphImage,
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AiverseWorld",
    description:
      "Search and compare AI tools with an enterprise-grade discovery experience.",
    images: ["/logo.png"],
  },
  // FIXED: Moved verification tag into Next.js metadata and fixed the property key
  verification: {
    google: "ca-pub-1921034562411070", 
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, requestHeaders] = await Promise.all([getServerSession(authOptions), headers()]);
  const nonce = requestHeaders.get("x-nonce") ?? undefined;
  const structuredData = buildGlobalStructuredData();

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
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
        <ConsentedScript
          async
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1921034562411070"
          crossOrigin="anonymous"
          nonce={nonce}
        />

        <AdNetworkScripts nonce={nonce} />
        <SiteShell nonce={nonce}>{children}</SiteShell>
        <CookieConsent />
        {session?.user ? (
          <Script id="chatbase-widget" nonce={nonce} strategy="afterInteractive">
            {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="oqIeeF-NRJYMKRywqI8DE";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
          </Script>
        ) : (
          <ChatSupportGate enabled={googleAuthEnabled} />
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
