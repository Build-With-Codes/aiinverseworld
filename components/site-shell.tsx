import { authOptions } from "@/auth";
import { AccountMenu } from "@/components/account-menu";
import { AdSlot } from "@/components/ad-slot";
import { AiToolsMenu } from "@/components/ai-tools-menu";
import { AuthDialog } from "@/components/auth-dialog";
import { HeaderSearch } from "@/components/header-search";
import { HeaderTrendingSearches } from "@/components/header-trending-searches";
import { MobileMenu } from "@/components/mobile-menu";
import { NavLink } from "@/components/nav-link";
import { SocialLink } from "@/components/social-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { googleAuthEnabled } from "@/lib/auth-config";
import { socialLinks } from "@/lib/social-links";
import logoImage from "@/public/logo.webp";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";

type SiteShellProps = {
  children: ReactNode;
  nonce?: string;
};

const navItems = [
  { href: "/", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/compare", label: "Compare" },
  { href: "/category", label: "Categories" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
];

const monetizationPages = [
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/advertising-disclosure", label: "Advertising Disclosure" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/dmca", label: "DMCA Policy" },
];

const footerGroups = [
  {
    title: "Platform",
    links: [
      { href: "/", label: "Home" },
      { href: "/blog", label: "Blog" },
      { href: "/problems", label: "Problems" },
      { href: "/problems/submit", label: "Submit Problem" },
      { href: "/games/hand-detect", label: "Motion Truck Drive" },
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

export async function SiteShell({ children, nonce }: SiteShellProps) {
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
              <div className="hidden w-[min(22vw,17rem)] xl:block">
                <HeaderSearch />
              </div>
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
          <HeaderTrendingSearches />
        </header>

        <main className="flex-1">
          {children}
          <AdSlot placement="nativeBanner" className="mx-auto mt-12" nonce={nonce} />
          <AdSlot placement="banner468x60" className="mx-auto mt-8" nonce={nonce} />
        </main>

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
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <SocialLink
                    key={link.name}
                    href={link.href}
                    name={link.name}
                  />
                ))}
              </div>
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
          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-xs leading-6 text-slate-400">
            AiverseWorld uses cookies and similar technologies for essential site
            functions, analytics, and advertising. Third-party partners, including
            Google AdSense where enabled, may use cookies or tracking scripts to
            measure ads, prevent fraud, and personalize advertising with your
            consent. Review our{" "}
            <Link href="/cookie-policy" className="font-semibold text-cyan-200 hover:text-cyan-100">
              Cookie Policy
            </Link>
            ,{" "}
            <Link href="/privacy" className="font-semibold text-cyan-200 hover:text-cyan-100">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/advertising-disclosure" className="font-semibold text-cyan-200 hover:text-cyan-100">
              Advertising Disclosure
            </Link>
            .
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-400">
            Copyright © 2026 AiverseWorld. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
