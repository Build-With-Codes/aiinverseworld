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
  { href: "/prompt-tools", label: "Prompt Tools" },
  { href: "/prompts", label: "Prompt Library" },
  { href: "/compare", label: "Compare" },
  { href: "/jobs", label: "Jobs" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/problems/submit", label: "Submit Problem" },
];

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/search", label: "Search" },
      { href: "/compare", label: "Compare" },
      { href: "/prompt-tools", label: "Prompt Tools" },
      { href: "/prompts", label: "Prompt Library" },
      { href: "/jobs", label: "Jobs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/news", label: "AI News" },
      { href: "/category", label: "Categories" },
      { href: "/collections", label: "Collections" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/security", label: "Security" },
      { href: "/problems/submit", label: "Submit Problem" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/cookie-policy", label: "Cookies" },
      { href: "/advertising-disclosure", label: "Advertising" },
    ],
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
          <div className="app-glass header-bar flex items-center justify-between rounded-pill border border-border-subtle bg-surface-2 px-3 py-3 backdrop-blur-xl transition-[box-shadow,border-color] duration-[var(--motion-dropdown)] ease-[var(--ease-premium)] sm:px-4">
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
                <p className="text-caption truncate font-semibold tracking-[0.2em] text-brand-electric-strong uppercase">
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
              <NavLink href="/prompts" label="Prompts" />
              <NavLink href="/compare" label="Compare" />
              <NavLink href="/jobs" label="Jobs" />
              <NavLink href="/blog" label="Blog" />
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden w-[min(24vw,18rem)] md:block">
                <HeaderSearch trendingQueries={trendingQueries} />
              </div>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

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
                    triggerClassName="min-h-11 cursor-pointer rounded-button bg-brand-electric px-4 py-2 text-sm font-semibold text-white shadow-card transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-brand-electric-strong hover:shadow-card-hover"
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

        <footer className="mt-16 border-t border-border-subtle py-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_repeat(4,minmax(0,0.55fr))]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="brand-logo-frame relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={logoImage}
                    alt="AiverseWorld logo"
                    fill
                    sizes="44px"
                    className="object-contain"
                  />
                </div>
                <p className="text-caption font-semibold tracking-[0.24em] text-brand-electric-strong uppercase">
                  AiverseWorld
                </p>
              </div>
              <p className="max-w-sm text-sm leading-6 text-text-secondary">
                A cohesive AI platform for tool discovery, comparisons, prompt workflows, news, and future-tech jobs.
              </p>
              <Link
                href="/contact"
                className="inline-flex rounded-pill border border-border-subtle px-3 py-1.5 text-xs font-semibold text-text-secondary transition hover:border-border-accent hover:text-text-primary"
              >
                Contact the team
              </Link>
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
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-primary">{group.title}</p>
                <div className="space-y-2">
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
          <div className="mt-8 border-t border-border-subtle pt-5 text-xs leading-5 text-text-muted">
            AiverseWorld uses cookies and similar technologies for essential site
            functions, analytics, and advertising. Third-party partners, including
            Google AdSense where enabled, may use cookies or tracking scripts to
            measure ads, prevent fraud, and personalize advertising with your
            consent. Review our{" "}
            <Link href="/cookie-policy" className="font-semibold text-brand-electric-strong hover:text-brand-electric">
              Cookie Policy
            </Link>
            ,{" "}
            <Link href="/privacy" className="font-semibold text-brand-electric-strong hover:text-brand-electric">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/advertising-disclosure" className="font-semibold text-brand-electric-strong hover:text-brand-electric">
              Advertising Disclosure
            </Link>
            .
          </div>
          <div className="mt-5 text-xs text-text-muted">
            Copyright © 2026 AiverseWorld. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
