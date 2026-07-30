"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type NavLinkProps = {
  href: string;
  label: string;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const active = useMemo(() => isActivePath(pathname, href), [pathname, href]);

  return (
    <Link
      href={href}
      className={`cursor-pointer rounded-pill px-4 py-2 text-sm font-semibold tracking-wide transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] ${
        active
          ? "bg-brand-electric/12 text-text-primary shadow-[0_0_0_1px_var(--border-accent)] hover:bg-brand-electric/18"
          : "text-text-secondary hover:bg-brand-electric/10 hover:text-text-primary"
      }`}
    >
      {label}
    </Link>
  );
}
