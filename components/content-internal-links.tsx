import Link from "next/link";

const internalLinks = [
  {
    href: "/best-ai-tools",
    title: "Browse the best AI tools",
    description: "See the main ranked directory across writing, coding, video, research, and productivity.",
  },
  {
    href: "/search",
    title: "Search AI tools by workflow",
    description: "Filter the catalog by use case, category, pricing model, platform, and API support.",
  },
  {
    href: "/compare",
    title: "Compare AI tools side by side",
    description: "Review pricing, features, platforms, and use cases before choosing a tool.",
  },
  {
    href: "/category",
    title: "Explore AI tool categories",
    description: "Jump into focused categories for assistants, coding, image generation, video, and automation.",
  },
  {
    href: "/blog",
    title: "Read AI tool guides",
    description: "Learn practical selection tips, prompt strategies, and software buying advice.",
  },
  {
    href: "/news",
    title: "Follow AI industry news",
    description: "Track product launches, policy updates, infrastructure moves, and market signals.",
  },
];

export function ContentInternalLinks() {
  return (
    <section className="mt-14 rounded-[30px] border border-white/10 bg-white/6 p-6 sm:p-7">
      <h2 className="text-xl font-semibold text-white">Continue exploring AiverseWorld</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {internalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-2xl border border-white/10 bg-[#081222] p-4 transition hover:border-cyan-300/35 hover:bg-cyan-300/8"
          >
            <h3 className="text-sm font-semibold text-cyan-100 group-hover:text-white">
              {link.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
