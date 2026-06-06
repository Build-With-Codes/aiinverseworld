"use client";

import { AuthDialog } from "@/components/auth-dialog";

type ChatSupportGateProps = {
  enabled: boolean;
};

export function ChatSupportGate({ enabled }: ChatSupportGateProps) {
  return (
    <div className="fixed right-4 bottom-4 z-[65] sm:right-6 sm:bottom-6">
      <AuthDialog
        callbackUrl="/"
        enabled={enabled}
        triggerLabel="Chat Support"
        title="Sign in to chat with support"
        description="We keep support chat available to signed-in users so conversations stay tied to the right account and follow-up history."
        triggerClassName="support-chat-trigger rounded-full border border-cyan-300/20 px-5 py-3 text-sm font-semibold shadow-[0_18px_45px_rgba(2,6,23,0.38)] backdrop-blur-xl transition hover:border-cyan-300/40"
      />
    </div>
  );
}
