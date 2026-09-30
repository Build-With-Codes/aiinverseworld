"use client";

import Image from "next/image";
import { useState } from "react";

type FaviconBadgeProps = {
  name: string;
  faviconUrl: string;
  className?: string;
  imgClassName?: string;
  labelClassName?: string;
};

export function FaviconBadge({
  name,
  faviconUrl,
  className = "",
  imgClassName = "",
  labelClassName = "",
}: FaviconBadgeProps) {
  const [failed, setFailed] = useState(false);
  const fallbackLetter = name.trim().slice(0, 1).toUpperCase();
  // An empty/missing faviconUrl must be treated the same as a failed load —
  // next/image throws immediately on a "" src (and never fires onError,
  // since no request is ever attempted), so this has to be caught upfront
  // rather than relying on the error handler below.
  const hasValidSrc = Boolean(faviconUrl);

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-white/10 ${className}`}
    >
      {hasValidSrc && !failed ? (
        <Image
          src={faviconUrl}
          alt={`${name} favicon`}
          fill
          sizes="48px"
          unoptimized
          className={`h-full w-full object-contain ${imgClassName}`}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={`font-semibold text-white ${labelClassName}`}>
          {fallbackLetter}
        </span>
      )}
    </div>
  );
}
