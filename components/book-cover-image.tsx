"use client";

import Image from "next/image";
import { useState } from "react";

type BookCoverImageProps = {
  src?: string | null;
  title: string;
  alt: string;
  sizes: string;
  className?: string;
  fallbackClassName?: string;
};

export function BookCoverImage({
  src,
  title,
  alt,
  sizes,
  className = "object-cover",
  fallbackClassName = "",
}: BookCoverImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_25%_18%,rgba(124,58,237,0.38),transparent_34%),linear-gradient(145deg,rgba(15,23,42,1),rgba(30,41,59,0.96)_42%,rgba(88,28,135,0.86))] px-3 text-center ${fallbackClassName}`}
      >
        <div className="absolute inset-y-3 left-3 w-1 rounded-full bg-gradient-to-b from-brand-cyan to-brand-violet opacity-80" />
        <div className="relative">
          <p className="mx-auto mb-2 h-8 w-8 rounded-md border border-white/20 bg-white/10 text-center text-lg font-black leading-8 text-white">
            A
          </p>
          <p className="line-clamp-4 text-xs font-semibold leading-snug text-white">{title}</p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-brand-cyan">AiverseWorld</p>
        </div>
      </div>
    );
  }

  return <Image src={src} alt={alt} fill sizes={sizes} className={className} onError={() => setFailed(true)} />;
}
