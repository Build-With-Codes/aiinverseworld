export type Category = {
  name: string;
  slug: string;
  count: number;
  description: string;
};

export type ComparisonSide = {
  slug: string;
  name: string;
  favicon: string;
  category: string;
};

export type Comparison = {
  slug: string;
  title: string;
  summary: string;
  left: ComparisonSide;
  right: ComparisonSide;
};

export type BestList = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
};

export type AITool = {
  id: string;
  rank: number;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  company: string;
  website: string;
  domain: string;
  favicon: string;
  logoUrl?: string;
  freePlan: "Yes" | "No" | "Limited";
  freeTrial: boolean;
  pricingModel: "Free" | "Freemium" | "Subscription" | "Usage-based" | "Enterprise" | "Custom";
  startingPriceUsd: number | null;
  pricingNotes?: string;
  shortDescription: string;
  summary?: string;
  features: string[];
  bestFor: string[];
  targetAudience: string[];
  tags: string[];
  aiType: string[];
  modalities: string[];
  modelProvider: string[];
  modelNames?: string[];
  apiAvailable: boolean;
  openSource: boolean;
  deploymentType: string[];
  platforms: string[];
  integrations?: string[];
  teamCollaboration?: boolean;
  security?: string[];
  privacyNotes?: string;
  popularityScore?: number;
  rating?: number;
  reviewCount?: number;
  status: "Active" | "Beta" | "Waitlist" | "Discontinued";
  launchYear?: number;
  lastVerified: string;
  sourceUrl: string;
  sourceType: "Official" | "Directory" | "Review" | "Manual";
  pros?: string[];
  cons?: string[];
  editorialVerdict?: string;
  alternativesNote?: string;
  faqs?: { question: string; answer: string }[];
  featureNotes?: { feature: string; benefit: string }[];
};

export type Spotlight = {
  key: string;
  emoji: string;
  label: string;
  blurb: string;
  tool: AITool;
};

export type CollectionSummary = {
  slug: string;
  emoji: string;
  title: string;
  tagline: string;
};

export type CollectionDetail = {
  slug: string;
  emoji: string;
  title: string;
  tagline: string;
  intro: string;
  body: string[];
  buyingGuide: string[];
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  seoDescription: string;
  tools: AITool[];
};

export type UserDashboard = {
  saved: AITool[];
  savedCount: number;
  recentlyViewed: AITool[];
  follows: string[];
  recommendations: AITool[];
  comparedCount: number;
  streak: number;
};
