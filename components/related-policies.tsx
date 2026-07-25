import Link from "next/link";

const policyLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/dmca", label: "DMCA Policy" },
  { href: "/copyright", label: "Copyright Policy" },
  { href: "/advertising-disclosure", label: "Advertising Disclosure" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/security", label: "Security" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function RelatedPolicies({ exclude }: { exclude: string }) {
  const items = policyLinks.filter((item) => item.href !== exclude);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white">Related policies</h2>
      <p className="text-base leading-8 text-text-secondary">
        These policies work together to describe how AiverseWorld operates.
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-pill border border-border-subtle bg-surface-3 px-4 py-2 text-sm text-text-secondary transition hover:border-border-accent hover:text-text-primary"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
