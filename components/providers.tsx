"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { ReactNode } from "react";

import { CompareTrayProvider } from "@/components/engagement/compare-tray";
import { SavedToolsProvider } from "@/components/engagement/saved-tools";

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <SavedToolsProvider>
        <CompareTrayProvider>{children}</CompareTrayProvider>
      </SavedToolsProvider>
    </SessionProvider>
  );
}
