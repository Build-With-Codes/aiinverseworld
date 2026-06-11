"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useTransition, useState } from "react";

import { GoogleSignOutButton } from "@/components/google-auth-button";

type AccountMenuProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  onClose?: () => void;
};

const quickLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Support" },
];

export function AccountMenu({ name, email, image, onClose }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const displayName = name || "Signed In";

  const handleToggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleHover = useCallback(() => {
    if (!open) {
      setOpen(true);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      
      // Don't close if clicking inside menu content
      if (contentRef.current?.contains(target)) {
        return;
      }
      
      // Don't close if clicking the toggle button
      if (buttonRef.current?.contains(target)) {
        return;
      }
      
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    const timeoutId = setTimeout(() => {
      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        onMouseEnter={handleHover}
        className="flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/6 px-3 py-2 transition hover:border-cyan-300/40 hover:bg-cyan-300/12 hover:text-white w-full"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={displayName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/12 text-xs font-semibold text-cyan-200">
            {(displayName || "U").slice(0, 1)}
          </div>
        )}
        <span className="hidden max-w-28 truncate text-sm font-medium text-white sm:inline flex-1">
          {displayName}
        </span>
      </button>

      {open ? (
        <div 
          ref={contentRef}
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 rounded-[26px] border border-white/10 bg-[#071120]/96 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl"
        >
          <div className="rounded-[22px] border border-white/10 bg-white/6 p-4">
            <div className="flex items-center gap-3">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={displayName}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-300/12 text-sm font-semibold text-cyan-200">
                  {(displayName || "U").slice(0, 1)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                {email ? (
                  <p className="truncate text-xs text-slate-400">{email}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block cursor-pointer rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
                onClick={() => {
                  handleClose();
                  onClose?.();
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4">
            <GoogleSignOutButton
              className="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-300/30 hover:text-white"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
