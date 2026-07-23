import Link from "next/link";

type SocialLinkProps = {
  href: string;
  name: string;
  label?: string;
};

export function SocialLink({ href, name, label }: SocialLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label ? `${name}: ${label}` : name}
      className="inline-flex items-center gap-2 rounded-full border border-border-accent bg-brand-cyan/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-border-accent hover:bg-brand-cyan/10 hover:text-white"
    >
      <SocialIcon name={name} />
      <span>{label ? `${name}: ${label}` : name}</span>
    </Link>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id="instagram-icon-gradient" x1="4" x2="20" y1="20" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FACC15" />
            <stop offset="0.42" stopColor="#F97316" />
            <stop offset="0.72" stopColor="#EC4899" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="url(#instagram-icon-gradient)" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.4" stroke="url(#instagram-icon-gradient)" strokeWidth="2" />
        <circle cx="16.8" cy="7.2" r="1.1" fill="#EC4899" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
      <path
        d="M14 8.2h2.4V4.5A15 15 0 0 0 13 4c-3.4 0-5.6 2-5.6 5.8V13H4v4.2h3.4V22h4.3v-4.8h3.4l.6-4.2h-4V10.2c0-1.2.3-2 2.3-2Z"
        fill="#1877F2"
      />
    </svg>
  );
}
