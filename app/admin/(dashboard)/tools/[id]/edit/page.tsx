import { notFound } from "next/navigation";
import type { Metadata } from "next";


import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { toolToFormValues } from "@/lib/admin-tools-client";
import { getToolById } from "@/lib/tool-catalog";

import { ToolForm } from "../../tool-form";

export const metadata: Metadata = buildNoIndexMetadata("Edit tool | AiverseWorld Admin");

export const dynamic = "force-dynamic";

export default async function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tool = await getToolById(id);
  if (!tool) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-heading-1 text-text-primary">Edit {tool.name}</h1>
      <ToolForm id={tool.id} initial={toolToFormValues(tool)} />
    </div>
  );
}
