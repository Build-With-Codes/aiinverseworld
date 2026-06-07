import { authOptions } from "@/auth";
import { AccountMenu } from "@/components/account-menu";
import { AuthDialog } from "@/components/auth-dialog";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { googleAuthEnabled } from "@/lib/auth-config";
import { monetizationPages } from "@/lib/site-data";
import logoImage from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Discover" },
  { href: "/news", label: "News" },
  { href: "/search", label: "Search" },
  { href: "/category/coding-ai", label: "Categories" },
  { href: "/compare/chatgpt-vs-claude", label: "Compare" },
  { href: "/about", label: "About" },
];

const footerGroups = [
  {
    title: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/news", label: "AI News" },
      { href: "/search", label: "Search" },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/security", label: "Security" },
      { href: "/copyright", label: "Copyright" },
    ],
  },
  {
    title: "Policies",
    links: monetizationPages,
  },
];

export async function SiteShell({ children }: SiteShellProps) {
  const session = await getServerSession(authOptions);

  return (
    <div className="app-shell min-h-screen text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-10 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-40 pt-4">
          <div className="app-glass flex items-center justify-between rounded-full border border-white/10 bg-white/6 px-3 py-3 shadow-[0_12px_40px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:px-4">
            <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="brand-logo-frame relative h-11 w-11 overflow-hidden rounded-full">
                <Image
                  src={logoImage}
                  alt="AiverseWorld logo"
                  fill
                  sizes="44px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold tracking-[0.18em] text-cyan-200 uppercase sm:text-sm sm:tracking-[0.24em]">
                  AiverseWorld
                </p>
                <p className="hidden text-xs text-slate-400 sm:block">
                  Discover the right AI stack
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/8 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <ThemeToggle />

              <div className="hidden md:block">
                {session?.user ? (
                  <AccountMenu
                    name={session.user.name}
                    email={session.user.email}
                    image={session.user.image}
                  />
                ) : (
                  <AuthDialog
                    callbackUrl="/"
                    enabled={googleAuthEnabled}
                    triggerClassName="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                  />
                )}
              </div>

              <MobileMenu
                navItems={navItems}
                authEnabled={googleAuthEnabled}
                isSignedIn={Boolean(session?.user)}
                userName={session?.user?.name}
                userEmail={session?.user?.email}
                userImage={session?.user?.image}
              />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="app-glass mt-16 rounded-[32px] border border-white/10 bg-white/6 px-6 py-10 backdrop-blur-xl sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="brand-logo-frame relative h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    src={logoImage}
                    alt="AiverseWorld logo"
                    fill
                    sizes="44px"
                    className="object-contain"
                  />
                </div>
                <p className="font-semibold tracking-[0.24em] text-cyan-200 uppercase">
                  AiverseWorld
                </p>
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-300">
                Enterprise-grade AI tool discovery for research, comparison, and
                confident vendor evaluation.
              </p>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-4 text-sm font-semibold text-white">{group.title}</p>
                <div className="space-y-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-slate-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">
            Copyright © 2026 AiverseWorld. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
