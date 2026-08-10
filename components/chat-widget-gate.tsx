"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

import { ChatSupportGate } from "@/components/chat-support-gate";
import { ConsentedScript } from "@/components/consented-script";

const chatbaseWidgetScript = `(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="oqIeeF-NRJYMKRywqI8DE";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`;

/** Signed-in users get the live Chatbase widget; signed-out get a sign-in prompt. See HeaderAuth for the session-fetch rationale. */
export function ChatWidgetGate({ enabled }: { enabled: boolean }) {
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

  if (session === undefined) return null;

  return session?.user ? (
    <ConsentedScript id="chatbase-widget">{chatbaseWidgetScript}</ConsentedScript>
  ) : (
    <ChatSupportGate enabled={enabled} />
  );
}
