"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { GoogleSignOutButton } from "@/components/google-auth-button";

type AccountMenuProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  onClose?: () => void;
};

const quickLinks = [
  { href: "/saved", label: "Saved tools" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Support" },
];

export function AccountMenu({ name, email, image, onClose }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(false);
  const displayName = name || "Signed In";

  const handleToggle = useCallback(() => {
    isOpenRef.current = !isOpenRef.current;
    setOpen(isOpenRef.current);
  }, []);

  const handleClose = useCallback(() => {
    isOpenRef.current = false;
    setOpen(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!isOpenRef.current) return;

      const target = event.target as Node;

      if (contentRef.current?.contains(target)) {
        return;
      }

      if (buttonRef.current?.contains(target)) {
        return;
      }

      handleClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpenRef.current) {
        handleClose();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose]);

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-full border border-border-subtle bg-surface-2 px-3 py-2 transition hover:border-border-accent hover:bg-brand-cyan/10 hover:text-white"
      >
        {image ? (
          <Image
            src={image}
            alt={displayName}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-cyan/10 text-xs font-semibold text-brand-cyan-strong">
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
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-72 rounded-card border border-border-subtle bg-surface-1/96 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl"
        >
          <div className="rounded-[22px] border border-border-subtle bg-surface-2 p-4">
            <div className="flex items-center gap-3">
              {image ? (
                <Image
                  src={image}
                  alt={displayName}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cyan/10 text-sm font-semibold text-brand-cyan-strong">
                  {(displayName || "U").slice(0, 1)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                {email ? (
                  <p className="truncate text-xs text-text-muted">{email}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block cursor-pointer rounded-2xl border border-border-subtle bg-surface-2 px-4 py-3 text-sm text-text-secondary transition hover:border-border-accent hover:bg-brand-cyan/10 hover:text-white"
                onClick={handleClose}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4">
            <GoogleSignOutButton
              className="w-full rounded-2xl border border-border-subtle px-4 py-3 text-sm font-medium text-text-secondary transition hover:border-border-accent hover:text-white"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
