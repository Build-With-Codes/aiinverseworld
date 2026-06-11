"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useTransition, useState } from "react";

import { AccountMenu } from "@/components/account-menu";
import { AuthDialog } from "@/components/auth-dialog";

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
};

export function MobileMenu({
  navItems,
  authEnabled,
  isSignedIn,
  userName,
  userEmail,
  userImage,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    startTransition(() => {
      setOpen((current) => !current);
    });
  }, []);

  const handleClose = useCallback(() => {
    startTransition(() => {
      setOpen(false);
    });
  }, []);

  const handleHover = useCallback(() => {
    if (!open) {
      startTransition(() => {
        setOpen(true);
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative md:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={handleToggle}
        onMouseEnter={handleHover}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/6 text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/12 hover:text-white"
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
          <span className="block h-0.5 w-4 rounded-full bg-current" />
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[min(22rem,calc(100vw-2rem))] rounded-[28px] border border-white/10 bg-[#071120]/96 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className="block cursor-pointer rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            {isSignedIn ? (
              <AccountMenu name={userName} email={userEmail} image={userImage} />
            ) : (
              <AuthDialog
                callbackUrl="/"
                enabled={authEnabled}
                triggerClassName="w-full cursor-pointer rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
