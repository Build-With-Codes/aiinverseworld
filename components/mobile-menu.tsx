"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { AuthDialog } from "@/components/auth-dialog";
import { GoogleSignOutButton } from "@/components/google-auth-button";
import { HeaderSearch } from "@/components/header-search";
import { ThemeToggle } from "@/components/theme-toggle";

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

const accountLinks = [
  { href: "/saved", label: "Saved tools" },
  { href: "/compare", label: "Compare tray" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Support" },
];

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
    document.body.style.overflow = open ? "hidden" : "";

    function handlePointerDown(event: PointerEvent) {
      if (!isOpenRef.current) return;

      const target = event.target as Node;
      const targetElement = target instanceof Element ? target : target.parentElement;

      if (targetElement?.closest("[data-auth-dialog='true']")) return;
      if (contentRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;

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
      document.body.style.overflow = "";
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, open]);

  return (
    <div className="relative md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={handleToggle}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-pill border border-border-subtle bg-surface-2 text-text-secondary transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:border-border-strong hover:bg-brand-electric/10 hover:text-text-primary"
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </span>
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[90] md:hidden">
              <button
                type="button"
                aria-label="Close navigation menu"
                className="absolute inset-0 cursor-default bg-slate-950/70 backdrop-blur-sm"
                onClick={handleClose}
              />
              <div
                ref={contentRef}
                className="absolute bottom-3 right-3 top-3 flex w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-dialog border border-border-subtle bg-surface-1/95 shadow-modal backdrop-blur-xl transition duration-[var(--motion-modal)] ease-[var(--ease-premium)]"
              >
                <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-4">
                  <div className="min-w-0">
                    <p className="text-eyebrow text-brand-electric-strong">Menu</p>
                    <p className="mt-1 truncate text-sm font-semibold text-text-primary">AiverseWorld</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <ThemeToggle />
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-surface-2 text-base font-semibold leading-none text-text-secondary transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:border-border-strong hover:text-text-primary"
                      aria-label="Close menu"
                    >
                      X
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                  <HeaderSearch onSubmit={handleClose} trendingQueries={trendingQueries} />

                  <div className="mt-5">
                    <p className="text-eyebrow mb-2 text-text-muted">Navigate</p>
                    <div className="grid gap-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleClose}
                          className="block cursor-pointer rounded-md border border-border-subtle bg-surface-2 px-4 py-3 text-sm font-semibold text-text-secondary transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:border-border-strong hover:bg-brand-electric/10 hover:text-text-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border-subtle pt-5">
                    {isSignedIn ? (
                      <div>
                        <p className="text-eyebrow mb-2 text-text-muted">Account</p>
                        <div className="rounded-card border border-border-subtle bg-surface-2 p-4">
                          <div className="flex items-center gap-3">
                            {userImage ? (
                              <Image
                                src={userImage}
                                alt={userName || "Signed in user"}
                                width={44}
                                height={44}
                                className="h-11 w-11 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-electric/10 text-sm font-semibold text-brand-electric-strong">
                                {(userName || "U").slice(0, 1)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-text-primary">
                                {userName || "Signed in"}
                              </p>
                              {userEmail ? <p className="truncate text-xs text-text-muted">{userEmail}</p> : null}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 grid gap-2">
                          {accountLinks.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={handleClose}
                              className="block cursor-pointer rounded-md border border-border-subtle bg-surface-2 px-4 py-3 text-sm font-semibold text-text-secondary transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:border-border-strong hover:bg-brand-electric/10 hover:text-text-primary"
                            >
                              {item.label}
                            </Link>
                          ))}
                          <GoogleSignOutButton
                            className="w-full cursor-pointer rounded-md border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:border-rose-300/60 hover:bg-rose-500/15"
                            label="Log out"
                          />
                        </div>
                      </div>
                    ) : (
                      <AuthDialog
                        callbackUrl="/"
                        enabled={authEnabled}
                        triggerClassName="min-h-11 w-full cursor-pointer rounded-button bg-brand-electric px-4 py-3 text-sm font-semibold text-white shadow-card transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-brand-electric-strong hover:shadow-card-hover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
