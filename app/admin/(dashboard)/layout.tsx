import Link from "next/link";
import type { ReactNode } from "react";

import { AdminLogoutButton } from "./admin-logout-button";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-1 text-text-primary">
      <header className="border-b border-border-subtle bg-surface-2">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm font-semibold tracking-[0.2em] text-brand-cyan-strong uppercase">
              AiverseWorld Admin
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-pill px-3 py-1.5 text-sm text-text-secondary transition hover:bg-brand-cyan/10 hover:text-text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-text-muted transition hover:text-text-primary">
              View site →
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
