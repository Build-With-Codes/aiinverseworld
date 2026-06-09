"use client";

import { AuthDialog } from "@/components/auth-dialog";
import { useEffect, useState } from "react";

type ChatSupportGateProps = {
  enabled: boolean;
};

export function ChatSupportGate({ enabled }: ChatSupportGateProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      const timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1500);

      setScrollTimeout(timeout);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollTimeout]);

  return (
    <div className="fixed right-4 bottom-4 z-[65] sm:right-6 sm:bottom-6">
      <AuthDialog
        callbackUrl="/"
        enabled={enabled}
        triggerLabel={isScrolling ? "" : "Chat Support"}
        title="Sign in to chat with support"
        description="We keep support chat available to signed-in users so conversations stay tied to the right account and follow-up history."
        triggerClassName={`support-chat-trigger inline-flex h-11 items-center justify-center rounded-full border border-cyan-300/20 py-3 text-sm font-semibold shadow-[0_18px_45px_rgba(2,6,23,0.38)] backdrop-blur-xl transition hover:border-cyan-300/40 ${
          isScrolling ? "w-11 px-0" : "w-auto px-5"
        }`}
      />
    </div>
  );
}
