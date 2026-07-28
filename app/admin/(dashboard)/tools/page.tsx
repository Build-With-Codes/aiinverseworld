import Link from "next/link";
import type { Metadata } from "next";


import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { cardClass } from "@/components/ui/card";
import { getToolCatalog } from "@/lib/tool-catalog";

import { ToolRowActions } from "./tool-row-actions";
import { ToolsCsvImportForm } from "./tools-csv-import-form";

export const metadata: Metadata = buildNoIndexMetadata("Admin tools | AiverseWorld");

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type AdminToolsPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function AdminToolsPage({ searchParams }: AdminToolsPageProps) {
  const { page: pageParam } = (await searchParams) ?? {};
  const page = Math.max(1, Number(pageParam) || 1);
  const { tools, pagination } = await getToolCatalog(PAGE_SIZE, undefined, page);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-1 text-text-primary">Tools</h1>
          <p className="text-body mt-1 text-text-secondary">
            {pagination.total} tools in the catalog. Import a CSV to add or update tools in bulk —
            each row is upserted by slug and reindexed into Pinecone for AI Finder search.
          </p>
        </div>
        <Link
          href="/admin/tools/new"
          className="cursor-pointer rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-5 py-2.5 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
        >
          New tool
        </Link>
      </div>

      <ToolsCsvImportForm />

      <div className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <p className="text-eyebrow text-brand-cyan-strong">Catalog</p>
        <p className="text-body mt-1 mb-4 text-text-secondary">
          Page {pagination.page} of {pagination.totalPages} — ranked by popularity.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Category</th>
                <th className="py-2 pr-4 font-medium">Pricing</th>
                <th className="py-2 pr-4 font-medium">Rating</th>
                <th className="py-2 pr-4 font-medium">Slug</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id} className="border-b border-border-subtle/60">
                  <td className="py-2 pr-4 font-medium text-text-primary">{tool.name}</td>
                  <td className="py-2 pr-4 text-text-secondary">{tool.category}</td>
                  <td className="py-2 pr-4 text-text-secondary">{tool.pricingModel}</td>
                  <td className="py-2 pr-4 text-text-secondary">{tool.rating ?? "—"}</td>
                  <td className="py-2 pr-4 text-text-muted">{tool.slug}</td>
                  <td className="py-2">
                    <ToolRowActions id={tool.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tools.length === 0 ? (
            <p className="py-6 text-center text-text-muted">No tools yet — import a CSV or add one above.</p>
          ) : null}
        </div>

        {pagination.totalPages > 1 ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-text-secondary">
            <span>
              {pagination.total} tools total — showing {tools.length} on this page
            </span>
            <div className="flex gap-2">
              <Link
                aria-disabled={pagination.page <= 1}
                href={`/admin/tools?page=${pagination.page - 1}`}
                className={`rounded-pill border border-border-subtle px-4 py-2 font-medium ${
                  pagination.page <= 1
                    ? "pointer-events-none opacity-40"
                    : "hover:border-border-accent hover:text-text-primary"
                }`}
              >
                Previous
              </Link>
              <Link
                aria-disabled={pagination.page >= pagination.totalPages}
                href={`/admin/tools?page=${pagination.page + 1}`}
                className={`rounded-pill border border-border-subtle px-4 py-2 font-medium ${
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none opacity-40"
                    : "hover:border-border-accent hover:text-text-primary"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
