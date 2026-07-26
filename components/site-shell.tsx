import { authOptions } from "@/auth";
import { AccountMenu } from "@/components/account-menu";
import { AiToolsMenu, type AiToolsMenuData } from "@/components/ai-tools-menu";
import { AuthDialog } from "@/components/auth-dialog";
import { HeaderScrollShell } from "@/components/header-scroll-shell";
import { HeaderSearch } from "@/components/header-search";
import { MobileMenu } from "@/components/mobile-menu";
import { NavLink } from "@/components/nav-link";
import { SocialLink } from "@/components/social-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { cardClass } from "@/components/ui/card";
import { googleAuthEnabled } from "@/lib/auth-config";
import { getRankings, getSpotlights, getTrending } from "@/lib/engagement";
import { socialLinks } from "@/lib/social-links";
import { getCategories, getNewestTools } from "@/lib/tool-catalog";
import logoImage from "@/public/logo.webp";
import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import type { ReactNode } from "react";

// SiteShell renders on every page, so any no-store fetch here would force
// every route dynamic regardless of that page's own cache settings.
const REVALIDATE_SECONDS = 300;

async function buildAiToolsMenuData(): Promise<AiToolsMenuData> {
  const [categoriesResult, spotlights, trending, fresh] = await Promise.all([
    getCategories(REVALIDATE_SECONDS),
    getSpotlights(REVALIDATE_SECONDS),
    getTrending("7d", 3, REVALIDATE_SECONDS),
    getNewestTools(3, REVALIDATE_SECONDS),
  ]);

  const seen = new Set<string>();
  function dedupe<T extends { slug: string }>(tools: T[]): T[] {
    return tools.filter((tool) => {
      if (seen.has(tool.slug)) return false;
      seen.add(tool.slug);
      return true;
    });
  }

  return {
    categories: categoriesResult.categories,
    featured: dedupe(spotlights.slice(0, 3).map((s) => s.tool)).map((tool) => ({
      tool,
      badge: "Featured",
    })),
    trending: dedupe(trending).map((tool) => ({ tool, badge: "Popular" })),
    fresh: dedupe(fresh).map((tool) => ({ tool, badge: "New" })),
  };
}

type SiteShellProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/compare", label: "Compare" },
  { href: "/jobs", label: "Jobs" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/problems/submit", label: "Submit Problem" },
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
      { href: "/faq", label: "FAQ" },
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
  const [session, aiToolsMenuData, mostSearchedTools] = await Promise.all([
    getServerSession(authOptions),
    buildAiToolsMenuData(),
    getRankings("most-searched", 6, REVALIDATE_SECONDS),
  ]);
  const trendingQueries = mostSearchedTools.map((tool) => tool.name);

  return (
    <div className="app-shell min-h-screen text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 pb-10 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-40 pt-4">
          <HeaderScrollShell>
          <div className="app-glass header-bar flex items-center justify-between rounded-pill border border-border-subtle bg-surface-2 px-3 py-3 shadow-card backdrop-blur-xl transition-[box-shadow,border-color] duration-300 sm:px-4">
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
                <p className="text-caption truncate font-semibold tracking-[0.2em] text-brand-cyan-strong uppercase">
                  AiverseWorld
                </p>
                <p className="hidden text-xs text-text-muted sm:block">
                  Discover the right AI stack
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              <NavLink href="/" label="Discover" />
              <AiToolsMenu data={aiToolsMenuData} />
              <NavLink href="/compare" label="Compare" />
              <NavLink href="/jobs" label="Jobs" />
              <NavLink href="/blog" label="Blog" />
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden w-[min(24vw,18rem)] md:block">
                <HeaderSearch trendingQueries={trendingQueries} />
              </div>
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
                    triggerClassName="cursor-pointer rounded-pill bg-gradient-to-r from-brand-electric to-brand-violet px-4 py-2 text-sm font-semibold text-white shadow-glow-cyan transition hover:brightness-110"
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
                trendingQueries={trendingQueries}
              />
            </div>
          </div>
          </HeaderScrollShell>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className={`app-glass mt-16 px-6 py-10 sm:px-8 ${cardClass({ radius: "card-lg", padding: "none" })}`}>
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
                <p className="text-caption font-semibold tracking-[0.24em] text-brand-cyan-strong uppercase">
                  AiverseWorld
                </p>
              </div>
              <p className="text-body max-w-md text-text-secondary">
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
                <p className="mb-4 text-sm font-semibold text-text-primary">{group.title}</p>
                <div className="space-y-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm text-text-muted transition hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-caption mt-8 rounded-sm border border-border-subtle bg-surface-1 p-4 leading-6 text-text-muted">
            AiverseWorld uses cookies and similar technologies for essential site
            functions, analytics, and advertising. Third-party partners, including
            Google AdSense where enabled, may use cookies or tracking scripts to
            measure ads, prevent fraud, and personalize advertising with your
            consent. Review our{" "}
            <Link href="/cookie-policy" className="font-semibold text-brand-cyan-strong hover:text-brand-cyan">
              Cookie Policy
            </Link>
            ,{" "}
            <Link href="/privacy" className="font-semibold text-brand-cyan-strong hover:text-brand-cyan">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/advertising-disclosure" className="font-semibold text-brand-cyan-strong hover:text-brand-cyan">
              Advertising Disclosure
            </Link>
            .
          </div>
          <div className="mt-10 border-t border-border-subtle pt-6 text-sm text-text-muted">
            Copyright © 2026 AiverseWorld. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
