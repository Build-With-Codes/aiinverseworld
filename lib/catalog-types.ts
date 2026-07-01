export type Category = {
  name: string;
  slug: string;
  count: number;
  description: string;
};

export type Comparison = {
  slug: string;
  title: string;
  summary: string;
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
};
