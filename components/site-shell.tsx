import { authOptions } from "@/auth";
import { AccountMenu } from "@/components/account-menu";
import { AiToolsMenu } from "@/components/ai-tools-menu";
import { AuthDialog } from "@/components/auth-dialog";
import { MobileMenu } from "@/components/mobile-menu";
import { NavLink } from "@/components/nav-link";
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
  { href: "/search", label: "Search" },
  { href: "/compare", label: "Compare" },
  { href: "/category", label: "Categories" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
];

const footerGroups = [
  {
    title: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/blog", label: "Blog" },
      { href: "/problems", label: "Problems" },
      { href: "/problems/submit", label: "Submit Problem" },
      { href: "/games/draw-guess", label: "Games" },
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
              <NavLink href="/" label="Discover" />
              <AiToolsMenu />
              <NavLink href="/news" label="News" />
              <NavLink href="/blog" label="Blog" />
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Link
                href="/problems/submit"
                className="hidden cursor-pointer rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/45 hover:bg-cyan-300/20 hover:text-white lg:inline-flex"
              >
                Submit Problem
              </Link>
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
                    triggerClassName="cursor-pointer rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
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
                Explore AI tools, expert guides, comparisons, industry insights, and emerging technology trends.
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
