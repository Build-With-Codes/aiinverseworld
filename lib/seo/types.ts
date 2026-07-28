export type BackendSeo = {
  title: string;
  description: string;
  keywords?: string[];
  canonical: string;
  robots?: {
    index: boolean;
    follow: boolean;
    archive?: boolean;
    imageIndex?: boolean;
  };
  openGraph?: {
    title: string;
    description: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title: string;
    description: string;
    image?: string;
  };
  alternates?: {
    languages?: Record<string, string>;
  };
  jsonLd?: object[];
  breadcrumb?: Array<{
    name: string;
    url: string;
  }>;
  seoVersion?: number;
  seoGeneratedAt?: string | null;
  seoGeneratedBy?: string | null;
  seoScore?: number | null;
  qualityScore?: number | null;
  needsReview?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
};
