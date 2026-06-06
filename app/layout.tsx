import type { Metadata } from "next";
import Script from "next/script";

import { authOptions } from "@/auth";
import { ChatSupportGate } from "@/components/chat-support-gate";
import { SiteShell } from "@/components/site-shell";
import { ThemeScript } from "@/components/theme-script";
import { googleAuthEnabled } from "@/lib/auth-config";
import { getServerSession } from "next-auth";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aiverseworld.example"),
  title: {
    default: "AiverseWorld | Discover the Perfect AI Tool",
    template: "%s",
  },
  description:
    "Discover, compare, and shortlist AI tools across writing, coding, video, research, and productivity.",
  openGraph: {
    title: "AiverseWorld",
    description:
      "Enterprise-grade AI tool discovery with search, comparisons, ratings, and curated categories.",
    url: "https://aiverseworld.example",
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
      <body className="min-h-full">
        <ThemeScript />
        <SiteShell>{children}</SiteShell>
        {session?.user ? (
          <Script id="chatbase-widget" strategy="afterInteractive">
            {`(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="oqIeeF-NRJYMKRywqI8DE";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`}
          </Script>
        ) : (
          <ChatSupportGate enabled={googleAuthEnabled} />
        )}
      </body>
    </html>
  );
}
