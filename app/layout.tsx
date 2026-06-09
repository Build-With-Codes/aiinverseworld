import type { Metadata } from "next";
import Script from "next/script";

import { authOptions } from "@/auth";
import { ChatSupportGate } from "@/components/chat-support-gate";
import { SiteShell } from "@/components/site-shell";
import { googleAuthEnabled } from "@/lib/auth-config";
import { buildUrl, siteUrl } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
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
      {
        url: "/logo.png",
        alt: "AiverseWorld logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AiverseWorld",
    description:
      "Search and compare AI tools with an enterprise-grade discovery experience.",
    images: ["/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">{`
          (() => {
            const stored = window.localStorage.getItem("aiverse-theme");
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const theme = stored === "light" || stored === "dark" ? stored : systemDark ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", theme);
          })();
        `}</Script>
        <Script id="aiverseworld-schema" type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AiverseWorld",
              url: siteUrl,
              logo: buildUrl("/logo.png"),
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "AiverseWorld",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
          ])}
        </Script>
        <SiteShell>{children}</SiteShell>
        {session?.user ? (
          <Script id="chatbase-widget" strategy="afterInteractive">
            {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="oqIeeF-NRJYMKRywqI8DE";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
          </Script>
        ) : (
          <ChatSupportGate enabled={googleAuthEnabled} />
        )}
        <Analytics />
      </body>
    </html>
  );
}
