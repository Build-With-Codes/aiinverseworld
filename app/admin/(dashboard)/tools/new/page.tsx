import type { Metadata } from "next";

import { ToolForm } from "../tool-form";

export const metadata: Metadata = {
  title: "New tool | AiverseWorld Admin",
  robots: { index: false, follow: false },
};

export default function NewToolPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-heading-1 text-text-primary">New tool</h1>
      <ToolForm />
    </div>
  );
}
