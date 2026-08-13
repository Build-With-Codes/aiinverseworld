import Image from "next/image";

import { compactNumber, relativeTime } from "@/components/trending/format";
import type { TrendingProject } from "@/lib/trending/types";

type TrendingProjectCardProps = {
  project: TrendingProject;
  featured?: boolean;
  saved?: boolean;
  showRank?: boolean;
  onToggleSave?: (project: TrendingProject) => void;
};

function projectInitials(name: string) {
  return name
    .split(/[-_\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TrendingProjectCard({
  project,
  featured = false,
  saved = false,
  showRank = false,
  onToggleSave,
}: TrendingProjectCardProps) {
  const image = project.logoUrl ?? project.avatarUrl;
  const primaryCategory = project.categories[0] ?? "Tools";

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-card-lg border bg-surface-2 shadow-[0_18px_60px_rgba(2,6,23,0.20)] transition duration-[var(--motion-hover)] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:bg-surface-3 hover:shadow-card-hover ${
        featured
          ? "border-brand-violet/45 p-6 shadow-glow-violet"
          : "border-border-subtle p-5 hover:border-border-strong"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        {showRank ? (
          <span
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-sm border px-2 text-sm font-bold ${
              project.rank <= 3
                ? "border-warning/35 bg-warning/15 text-warning"
                : "border-border-subtle bg-surface-3 text-text-secondary"
            }`}
          >
            {project.rank}
          </span>
        ) : (
          <span className="rounded-pill border border-border-subtle bg-surface-3 px-3 py-1 text-xs font-semibold text-text-muted">
            {primaryCategory}
          </span>
        )}
        {onToggleSave ? (
        <button
          type="button"
          onClick={() => onToggleSave(project)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-pill border transition hover:-translate-y-0.5 ${
            saved
              ? "border-brand-violet/40 bg-brand-violet/15 text-brand-violet"
              : "border-border-subtle bg-surface-1 text-text-muted hover:border-border-accent hover:text-text-primary"
          }`}
          aria-label={saved ? `Remove ${project.name} from saved projects` : `Save ${project.name}`}
        >
          <span aria-hidden>{saved ? "★" : "☆"}</span>
        </button>
        ) : null}
      </div>

      <div className={`${featured ? "mt-5" : "mt-4"} flex items-center gap-4`}>
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-card border border-border-subtle bg-surface-1">
          {image ? (
            <Image
              src={image}
              alt={`${project.owner} avatar`}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-brand-cyan-strong">{projectInitials(project.name)}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className={`${featured ? "text-2xl" : "text-xl"} truncate font-bold text-text-primary`}>
            {project.name}
          </h3>
          <p className="truncate text-sm text-text-secondary">{primaryCategory}</p>
        </div>
      </div>

      <p className={`${featured ? "mt-5 text-sm leading-7" : "mt-4 text-sm leading-6"} line-clamp-3 text-text-secondary`}>
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-sm text-text-secondary">
        <span className="rounded-pill border border-border-subtle bg-surface-1 px-3 py-1">
          Stars {compactNumber(project.stars)}
        </span>
        <span className="rounded-pill border border-border-subtle bg-surface-1 px-3 py-1">
          Forks {compactNumber(project.forks)}
        </span>
        <span className="rounded-pill border border-border-subtle bg-surface-1 px-3 py-1">
          Active {relativeTime(project.pushedAt ?? project.lastUpdated)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[primaryCategory, project.language, ...project.topics.slice(0, featured ? 2 : 1)]
          .filter(Boolean)
          .slice(0, featured ? 4 : 3)
          .map((tag) => (
            <span
              key={String(tag)}
              className="rounded-sm bg-brand-violet/15 px-2.5 py-1 text-xs font-medium text-brand-violet"
            >
              {tag}
            </span>
          ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-subtle pt-4 text-sm">
        <span className="min-w-0 truncate text-text-muted">github.com/{project.fullName}</span>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-semibold text-brand-cyan-strong transition hover:text-brand-cyan"
        >
          View
          <span className="sr-only"> {project.name} on GitHub</span>
        </a>
      </div>
    </article>
  );
}
