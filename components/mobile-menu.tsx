"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { AccountMenu } from "@/components/account-menu";
import { AuthDialog } from "@/components/auth-dialog";
import { HeaderSearch } from "@/components/header-search";

type NavItem = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  navItems: NavItem[];
  authEnabled: boolean;
  isSignedIn: boolean;
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
  trendingQueries?: string[];
};

export function MobileMenu({
  navItems,
  authEnabled,
  isSignedIn,
  userName,
  userEmail,
  userImage,
  trendingQueries,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isOpenRef = useRef(false);

  const handleToggle = useCallback(() => {
    isOpenRef.current = !isOpenRef.current;
    setOpen(isOpenRef.current);
  }, []);

  const handleClose = useCallback(() => {
    isOpenRef.current = false;
    setOpen(false);
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!isOpenRef.current) return;

      const target = event.target as Node;
      const targetElement = target instanceof Element ? target : target.parentElement;

      if (targetElement?.closest("[data-auth-dialog='true']")) {
        return;
      }

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
    <div ref={menuRef} className="relative md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={handleToggle}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill border border-border-subtle bg-surface-2 text-text-secondary transition hover:border-border-accent hover:bg-brand-cyan/12 hover:text-text-primary"
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </span>
      </button>

      {open ? (
        <div
          ref={contentRef}
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(22rem,calc(100vw-2rem))] rounded-card-lg border border-border-subtle bg-surface-glass p-4 shadow-card-hover backdrop-blur-xl"
        >
          <HeaderSearch onSubmit={handleClose} trendingQueries={trendingQueries} />

          <div className="mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className="block cursor-pointer rounded-sm border border-border-subtle bg-surface-3 px-4 py-3 text-sm text-text-secondary transition hover:border-border-accent hover:bg-brand-cyan/10 hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-border-subtle pt-4">
            {isSignedIn ? (
              <AccountMenu
                name={userName}
                email={userEmail}
                image={userImage}
                onClose={handleClose}
              />
            ) : (
              <AuthDialog
                callbackUrl="/"
                enabled={authEnabled}
                triggerClassName="w-full cursor-pointer rounded-sm bg-gradient-to-r from-brand-electric to-brand-violet px-4 py-3 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
