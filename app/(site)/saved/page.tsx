import type { Metadata } from "next";


import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { authOptions } from "@/auth";
import { AuthDialog } from "@/components/auth-dialog";
import { SectionHeading } from "@/components/section-heading";
import { googleAuthEnabled } from "@/lib/auth-config";
import { backendMeFetch } from "@/lib/me-proxy";
import { AIVERSE_JOBS_BASE_URL, INTERNAL_API_KEY } from "@/lib/service-urls";
import type { AITool } from "@/lib/catalog-types";
import type { AiPrompt } from "@/lib/prompts-api";
import { getServerSession } from "next-auth";

import { SavedPromptsGrid } from "./saved-prompts-grid";
import { SavedToolsGrid } from "./saved-tools-grid";

export const metadata: Metadata = buildNoIndexMetadata("Saved library | AiverseWorld");

export const dynamic = "force-dynamic";

async function getSavedTools(userId: string): Promise<AITool[]> {
  const res = await backendMeFetch("saved", { userId });
  if (!res.ok) return [];
  const payload = (await res.json()) as { data?: AITool[] };
  return payload.data ?? [];
}

async function getSavedPrompts(userId: string): Promise<AiPrompt[]> {
  const url = new URL(`${AIVERSE_JOBS_BASE_URL}/prompts/me/saved`);
  url.searchParams.set("userId", userId);
  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "x-internal-api-key": INTERNAL_API_KEY,
    },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const payload = (await res.json()) as { data?: AiPrompt[] };
  return payload.data ?? [];
}

export default async function SavedToolsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const [tools, prompts] = userId ? await Promise.all([getSavedTools(userId), getSavedPrompts(userId)]) : [[], []];

  return (
    <div className="space-y-8 py-10">
      <SectionHeading
        level="h1"
        eyebrow="Your library"
        title="Saved tools and prompts"
        description="Your bookmarked tools and production prompts, synced across every device you're signed in on."
      />

      {!userId ? (
        <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-10 text-center">
          <p className="text-heading-2 text-text-primary">Sign in to see your saved tools</p>
          <p className="text-body mt-2 text-text-secondary">
            Save tools and prompts from any page and they&apos;ll show up here, synced across every device.
          </p>
          <div className="mt-5 flex justify-center">
            <AuthDialog
              callbackUrl="/saved"
              enabled={googleAuthEnabled}
              triggerClassName="cursor-pointer rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-5 py-2.5 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
              triggerLabel="Sign in"
              title="Sign in to AiverseWorld"
              description="Use your account to save tools and prompts, sync across devices, and get personalized recommendations."
            />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-card border border-border-subtle bg-surface-2 p-5 shadow-card">
              <p className="text-sm font-semibold uppercase text-brand-cyan-strong">Saved tools</p>
              <p className="mt-2 text-3xl font-bold text-text-primary">{tools.length}</p>
              <p className="mt-1 text-sm text-text-muted">Tool bookmarks in your account.</p>
            </div>
            <div className="rounded-card border border-border-subtle bg-surface-2 p-5 shadow-card">
              <p className="text-sm font-semibold uppercase text-brand-cyan-strong">Saved prompts</p>
              <p className="mt-2 text-3xl font-bold text-text-primary">{prompts.length}</p>
              <p className="mt-1 text-sm text-text-muted">Prompt bookmarks from the library.</p>
            </div>
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-heading-2 text-text-primary">Saved tools</h2>
              <p className="mt-1 text-sm text-text-muted">AI tools you want to revisit.</p>
            </div>
            <SavedToolsGrid initialTools={tools} />
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-heading-2 text-text-primary">Saved prompts</h2>
              <p className="mt-1 text-sm text-text-muted">Prompts ready to copy into your workflow.</p>
            </div>
            <SavedPromptsGrid initialPrompts={prompts} />
          </section>
        </div>
      )}
    </div>
  );
}
