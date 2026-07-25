export type CategoryTone = "cyan" | "emerald" | "violet" | "blue" | "amber" | "rose";

const TONE_CLASSES: Record<CategoryTone, { icon: string; badge: string; ring: string; text: string }> = {
  cyan: {
    icon: "text-cyan-300",
    badge: "border-cyan-400/25 bg-cyan-400/10",
    ring: "group-hover:border-cyan-400/50",
    text: "text-cyan-300",
  },
  emerald: {
    icon: "text-emerald-300",
    badge: "border-emerald-400/25 bg-emerald-400/10",
    ring: "group-hover:border-emerald-400/50",
    text: "text-emerald-300",
  },
  violet: {
    icon: "text-violet-300",
    badge: "border-violet-400/25 bg-violet-400/10",
    ring: "group-hover:border-violet-400/50",
    text: "text-violet-300",
  },
  blue: {
    icon: "text-blue-300",
    badge: "border-blue-400/25 bg-blue-400/10",
    ring: "group-hover:border-blue-400/50",
    text: "text-blue-300",
  },
  amber: {
    icon: "text-amber-300",
    badge: "border-amber-400/25 bg-amber-400/10",
    ring: "group-hover:border-amber-400/50",
    text: "text-amber-300",
  },
  rose: {
    icon: "text-rose-300",
    badge: "border-rose-400/25 bg-rose-400/10",
    ring: "group-hover:border-rose-400/50",
    text: "text-rose-300",
  },
};

const TONE_KEYS = Object.keys(TONE_CLASSES) as CategoryTone[];

/** Deterministic so the same category always gets the same tone, in a grid card or its own detail page. */
export function getCategoryTone(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 997;
  }
  return TONE_CLASSES[TONE_KEYS[hash % TONE_KEYS.length]];
}

type IconName = "assistant" | "search" | "code" | "image" | "video" | "audio" | "writing" | "default";

const ICON_PATHS: Record<IconName, string> = {
  assistant: "M4 4h16v12H9l-5 4V4z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  code: "M9 18l-6-6 6-6M15 6l6 6-6 6",
  image: "M4 4h16v16H4V4zM4 16l5-5 4 4 3-3 4 4",
  video: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10 9l5 3-5 3V9z",
  audio: "M4 20V10M9 20V4M14 20V14M19 20V8",
  writing: "M4 20h4l10-10-4-4L4 16v4zM14 6l4 4",
  default: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z",
};

const ICON_MATCHERS: { match: RegExp; icon: IconName }[] = [
  { match: /assistant|automat|agent/i, icon: "assistant" },
  { match: /search|research/i, icon: "search" },
  { match: /cod|develop/i, icon: "code" },
  { match: /image|design|art|photo/i, icon: "image" },
  { match: /video|film/i, icon: "video" },
  { match: /audio|music/i, icon: "audio" },
  { match: /writ|market|content|product/i, icon: "writing" },
];

function getCategoryIconName(categoryName: string): IconName {
  return ICON_MATCHERS.find(({ match }) => match.test(categoryName))?.icon ?? "default";
}

export function CategoryIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const iconName = getCategoryIconName(name);
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d={ICON_PATHS[iconName]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
