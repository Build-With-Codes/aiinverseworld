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
      className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition duration-200 ${
        active
          ? "bg-cyan-300/14 text-white shadow-[0_0_0_1px_rgba(34,211,238,0.22)] hover:bg-cyan-300/22"
          : "text-slate-300 hover:bg-cyan-300/12 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
