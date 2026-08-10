"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

import { AccountMenu } from "@/components/account-menu";
import { AuthDialog } from "@/components/auth-dialog";
import { googleAuthEnabled } from "@/lib/auth-config";

/**
 * Desktop header auth slot. Session is fetched client-side via the
 * imperative getSession() so SiteShell never calls getServerSession() —
 * that (plus headers() for the CSP nonce) was forcing every route into
 * fully dynamic, uncached rendering regardless of the page's own
 * `revalidate` setting. A rejected fetch resolves to signed-out instead of
 * leaving the header stuck on its loading skeleton forever.
 */
export function HeaderAuth() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getSession()
      .then((value) => {
        if (active) setSession(value);
      })
      .catch(() => {
        if (active) setSession(null);
      });
    return () => {
      active = false;
    };
  }, []);

  if (session === undefined) {
    return <div className="h-11 w-24 animate-pulse rounded-button bg-surface-3" aria-hidden />;
  }

  return session?.user ? (
    <AccountMenu name={session.user.name} email={session.user.email} image={session.user.image} />
  ) : (
    <AuthDialog
      callbackUrl="/"
      enabled={googleAuthEnabled}
      triggerClassName="min-h-11 min-w-24 cursor-pointer rounded-button bg-brand-electric px-4 py-2 text-sm font-semibold text-white shadow-card transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-brand-electric-strong hover:shadow-card-hover"
    />
  );
}
