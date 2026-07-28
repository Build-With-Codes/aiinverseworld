import type { Metadata } from "next";


import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { BlogPostForm } from "../blog-post-form";

export const metadata: Metadata = buildNoIndexMetadata("New blog post | AiverseWorld Admin");

export default function NewBlogPostPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-heading-1 text-text-primary">New post</h1>
      <BlogPostForm />
    </div>
  );
}
