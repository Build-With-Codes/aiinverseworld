import Link from "next/link";
import type { Metadata } from "next";


import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { cardClass } from "@/components/ui/card";
import { backendAdminFetch, getAdminKeyFromCookies } from "@/lib/admin-proxy";
import { getToolCatalog } from "@/lib/tool-catalog";

import { RecomputeStatsButton } from "./recompute-stats-button";
import { ResetCacheButton } from "./reset-cache-button";

export const metadata: Metadata = buildNoIndexMetadata("Admin dashboard | AiverseWorld");

export const dynamic = "force-dynamic";

async function getCounts() {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return { tools: 0, posts: 0, reviews: 0 };

  const [toolsCatalog, blogRes, reviewsRes] = await Promise.all([
    getToolCatalog(1),
    backendAdminFetch("blog", { adminKey, query: { limit: "1" } }),
    backendAdminFetch("reviews", { adminKey, query: { limit: "1" } }),
  ]);
  const blog = blogRes.ok ? ((await blogRes.json()) as { pagination?: { total: number } }) : undefined;
  const reviews = reviewsRes.ok
    ? ((await reviewsRes.json()) as { pagination?: { total: number } })
    : undefined;

  return {
    tools: toolsCatalog.pagination.total,
    posts: blog?.pagination?.total ?? 0,
    reviews: reviews?.pagination?.total ?? 0,
  };
}

export default async function AdminHomePage() {
  const counts = await getCounts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-heading-1 text-text-primary">Overview</h1>
        <p className="text-body mt-1 text-text-secondary">
          Manage tools, blog content, and reviews. Premium billing is not yet part of this panel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/tools" className={cardClass({ hover: true, padding: "lg", radius: "card-lg" })}>
          <p className="text-eyebrow text-brand-cyan-strong">Tools</p>
          <p className="text-heading-2 mt-2 text-text-primary">{counts.tools} tools</p>
          <p className="text-body mt-1 text-text-secondary">Import CSVs, browse the catalog.</p>
        </Link>
        <Link href="/admin/blog" className={cardClass({ hover: true, padding: "lg", radius: "card-lg" })}>
          <p className="text-eyebrow text-brand-cyan-strong">Blog</p>
          <p className="text-heading-2 mt-2 text-text-primary">{counts.posts} posts</p>
          <p className="text-body mt-1 text-text-secondary">Create, edit, publish, and delete posts.</p>
        </Link>
        <Link href="/admin/reviews" className={cardClass({ hover: true, padding: "lg", radius: "card-lg" })}>
          <p className="text-eyebrow text-brand-cyan-strong">Reviews</p>
          <p className="text-heading-2 mt-2 text-text-primary">{counts.reviews} reviews</p>
          <p className="text-body mt-1 text-text-secondary">Moderate and remove reviews.</p>
        </Link>
      </div>

      <div className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <p className="text-eyebrow text-brand-cyan-strong">Maintenance</p>
        <p className="text-body mt-1 mb-4 text-text-secondary">
          Recompute trending/most-saved rankings from accumulated engagement events. This also runs
          automatically every 60 minutes.
        </p>
        <div className="flex flex-wrap gap-3">
          <RecomputeStatsButton />
          <ResetCacheButton />
        </div>
      </div>
    </div>
  );
}
