"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import type { MediaRef } from "@/lib/blog-api";

type MediaImageProps = {
  media: MediaRef;
  /** Fill mode: caller provides a positioned aspect container. */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  showCaption?: boolean;
  /** Rendered instead of the image when there's no URL, or it fails to load. */
  fallback?: ReactNode;
};

/**
 * Renders a media-library asset through next/image with its blur placeholder,
 * responsive sizing, and an optional caption/credit. Assets are already
 * optimized (webp) upstream; next/image adds responsive delivery + lazy load.
 * Falls back to `fallback` (or nothing) rather than a broken-image icon or
 * empty space when the URL is missing or fails to load.
 */
export function MediaImage({
  media,
  fill = false,
  sizes,
  priority = false,
  className = "",
  imgClassName = "",
  showCaption = false,
  fallback = null,
}: MediaImageProps) {
  const [failed, setFailed] = useState(false);

  if (!media.url || failed) return <>{fallback}</>;

  const blur = media.blurDataUrl
    ? ({ placeholder: "blur" as const, blurDataURL: media.blurDataUrl })
    : {};
  // Local/dev fallback assets are served over http from the API; skip the
  // optimizer for those. Production R2 assets are https and get optimized.
  const unoptimized = media.url.startsWith("http://");

  const image = fill ? (
    <Image
      src={media.url}
      alt={media.alt}
      fill
      sizes={sizes ?? "100vw"}
      priority={priority}
      unoptimized={unoptimized}
      className={`object-cover ${imgClassName}`}
      onError={() => setFailed(true)}
      {...blur}
    />
  ) : (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width ?? 1600}
      height={media.height ?? 900}
      sizes={sizes ?? "100vw"}
      priority={priority}
      unoptimized={unoptimized}
      className={`h-auto w-full ${imgClassName}`}
      onError={() => setFailed(true)}
      {...blur}
    />
  );

  if (!showCaption || (!media.caption && !media.credit)) {
    return fill ? image : <div className={className}>{image}</div>;
  }

  return (
    <figure className={className}>
      {image}
      <figcaption className="text-caption mt-2 text-center text-text-muted">
        {media.caption}
        {media.caption && media.credit ? " · " : ""}
        {media.credit ? <span className="italic">{media.credit}</span> : null}
      </figcaption>
    </figure>
  );
}
