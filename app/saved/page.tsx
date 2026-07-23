import type { Metadata } from "next";

import { authOptions } from "@/auth";
import { AuthDialog } from "@/components/auth-dialog";
import { SectionHeading } from "@/components/section-heading";
import { googleAuthEnabled } from "@/lib/auth-config";
import { backendMeFetch } from "@/lib/me-proxy";
import type { AITool } from "@/lib/catalog-types";
import { getServerSession } from "next-auth";

import { SavedToolsGrid } from "./saved-tools-grid";

export const metadata: Metadata = {
  title: "Saved tools | AiverseWorld",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function getSavedTools(userId: string): Promise<AITool[]> {
  const res = await backendMeFetch("saved", { userId });
  if (!res.ok) return [];
  const payload = (await res.json()) as { data?: AITool[] };
  return payload.data ?? [];
}

export default async function SavedToolsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const tools = userId ? await getSavedTools(userId) : [];

  return (
    <div className="space-y-8 py-10">
      <SectionHeading
        eyebrow="Your library"
        title="Saved tools"
        description="Tools you've bookmarked, synced across every device you're signed in on."
      />

      {!userId ? (
        <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-10 text-center">
          <p className="text-heading-2 text-text-primary">Sign in to see your saved tools</p>
          <p className="text-body mt-2 text-text-secondary">
            Save tools from any page and they&apos;ll show up here, synced across every device.
          </p>
          <div className="mt-5 flex justify-center">
            <AuthDialog
              callbackUrl="/saved"
              enabled={googleAuthEnabled}
              triggerClassName="cursor-pointer rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-5 py-2.5 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
              triggerLabel="Sign in"
              title="Sign in to AiverseWorld"
              description="Use your account to save tools, sync across devices, and get personalized recommendations."
            />
          </div>
        </div>
      ) : (
        <SavedToolsGrid initialTools={tools} />
      )}
    </div>
  );
}
