import type { Metadata } from "next";

import type { BackendSeo } from "@/lib/seo/types";

export function buildMetadata(seo: BackendSeo): Metadata {
  const ogTitle = seo.openGraph?.title ?? seo.ogTitle ?? seo.title;
  const ogDescription = seo.openGraph?.description ?? seo.ogDescription ?? seo.description;
  const ogImage = seo.openGraph?.image ?? seo.ogImage;
  const twitterTitle = seo.twitter?.title ?? seo.twitterTitle ?? ogTitle;
  const twitterDescription =
    seo.twitter?.description ?? seo.twitterDescription ?? ogDescription;
  const twitterImage = seo.twitter?.image ?? ogImage;

  const robots = seo.robots
    ? {
        index: seo.robots.index,
        follow: seo.robots.follow,
        nocache: seo.robots.archive === false,
        googleBot: {
          index: seo.robots.index,
          follow: seo.robots.follow,
          noimageindex: seo.robots.imageIndex === false,
        },
      }
    : undefined;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots,
    alternates: {
      canonical: seo.canonical,
      languages: seo.alternates?.languages,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: seo.canonical,
      type: (seo.openGraph?.type as "website" | "article" | undefined) ?? "website",
      images: ogImage ? [{ url: ogImage, alt: ogTitle }] : undefined,
    },
    twitter: {
      card: seo.twitter?.card ?? "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export function buildNoIndexMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  };
}
