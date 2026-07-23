import Link from "next/link";
import type { Metadata } from "next";

import { backendAdminFetch, getAdminKeyFromCookies } from "@/lib/admin-proxy";
import { cardClass } from "@/components/ui/card";

import { BlogRowActions } from "./blog-row-actions";

export const metadata: Metadata = {
  title: "Blog admin | AiverseWorld",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type AdminPostCard = {
  slug: string;
  title: string;
  category: string;
  featured: boolean;
  published: boolean;
  updatedAt: string;
};

async function getPosts(): Promise<AdminPostCard[]> {
  const adminKey = await getAdminKeyFromCookies();
  if (!adminKey) return [];

  const res = await backendAdminFetch("blog", { adminKey, query: { limit: "100" } });
  if (!res.ok) return [];
  const payload = (await res.json()) as { data?: AdminPostCard[] };
  return payload.data ?? [];
}

export default async function AdminBlogListPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-1 text-text-primary">Blog posts</h1>
          <p className="text-body mt-1 text-text-secondary">{posts.length} total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="cursor-pointer rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-5 py-2.5 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
        >
          New post
        </Link>
      </div>

      <div className={cardClass({ padding: "none", radius: "card-lg" })}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-text-muted">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.slug} className="border-b border-border-subtle last:border-0">
                <td className="max-w-xs truncate px-5 py-3 text-text-primary">{post.title}</td>
                <td className="px-5 py-3 text-text-secondary">{post.category}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-pill px-2.5 py-1 text-xs font-semibold ${
                      post.published
                        ? "bg-emerald-500/12 text-emerald-400"
                        : "bg-amber-500/12 text-amber-400"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  {post.featured ? (
                    <span className="ml-2 rounded-pill bg-brand-violet/12 px-2.5 py-1 text-xs font-semibold text-brand-violet-strong">
                      Featured
                    </span>
                  ) : null}
                </td>
                <td className="px-5 py-3 text-text-muted">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <BlogRowActions slug={post.slug} />
                </td>
              </tr>
            ))}
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-text-muted">
                  No posts yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
