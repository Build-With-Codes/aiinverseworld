import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { ConsentMode } from "@/components/consent-mode";
import { Providers } from "@/components/providers";
import { siteUrl } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildGlobalStructuredData, jsonLd } from "@/lib/structured-data";
import { getRouteSeo } from "@/services/seo.service";

import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body-sans",
  display: "swap",
});

const rootMetadata = buildMetadata(getRouteSeo("/"));
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-8RHHLW4YVF";

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
  verification: {
    google: "ca-pub-1921034562411070",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * True root layout — deliberately minimal. No headers()/getServerSession()
 * here or anywhere in this file's own render path, so it never forces
 * routes into dynamic rendering. The admin/public split is resolved by
 * route groups (app/(site)/ vs app/admin/) at the file-system level, not by
 * runtime logic here — each group brings its own layout underneath this
 * one. Session state for the few UI pieces that need it (header account
 * menu, mobile menu, chat widget) is fetched client-side inside those
 * specific components (see HeaderAuth, MobileMenu, ChatWidgetGate) —
 * Providers gets session={null} and getSession() calls broadcast the real
 * value to every useSession() consumer in the tree once resolved.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = buildGlobalStructuredData();

  return (
    <html
      lang="en"
      className={`h-full antialiased ${bodyFont.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          id="theme-init"
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
        <ConsentMode />
        <script
          async
          id="google-analytics-loader"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`}
        />
        <script
          id="google-analytics-config"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}
              window.gtag("js", new Date());
              window.gtag("config", ${JSON.stringify(gaMeasurementId)});
            `,
          }}
        />
        <script
          id="aiverseworld-global-schema"
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <Providers session={null}>{children}</Providers>
      </body>
    </html>
  );
}
