"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { AuthDialog } from "@/components/auth-dialog";
import {
  fetchFollows,
  followCategory,
  unfollowCategory,
} from "@/lib/engagement-client";
import { googleAuthEnabled } from "@/lib/auth-config";

export function FollowCategoryButton({
  category,
  callbackUrl = "/",
}: {
  category: string;
  callbackUrl?: string;
}) {
  const { status } = useSession();
  const signedIn = status === "authenticated";
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!signedIn) {
      setFollowing(false);
      return;
    }
    fetchFollows().then((cats) => {
      if (!cancelled) setFollowing(cats.includes(category));
    });
    return () => {
      cancelled = true;
    };
  }, [signedIn, category]);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    const next = !following;
    setFollowing(next);
    const result = next
      ? await followCategory(category)
      : await unfollowCategory(category);
    if (result !== next) setFollowing(!next);
    setBusy(false);
  }

  const className = `inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-semibold transition ${
    following
      ? "border-border-accent bg-brand-cyan/10 text-brand-cyan-strong"
      : "border-border-strong bg-surface-3 text-text-primary hover:border-border-accent"
  }`;

  if (!signedIn) {
    return (
      <AuthDialog
        callbackUrl={callbackUrl}
        enabled={googleAuthEnabled}
        triggerClassName={className}
        triggerLabel={
          <>
            <span aria-hidden>＋</span>
            <span>Follow</span>
          </>
        }
        title={`Follow ${category}`}
        description="Sign in to follow categories and get trending updates tailored to your interests."
      />
    );
  }

  return (
    <button type="button" onClick={handleClick} disabled={busy} className={className}>
      <span aria-hidden>{following ? "✓" : "＋"}</span>
      <span>{following ? "Following" : "Follow"}</span>
    </button>
  );
}
