import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";
import { ThemeScript } from "@/components/theme-script";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <ThemeScript />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
