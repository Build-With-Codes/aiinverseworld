"use client";

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

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-white/10 ${className}`}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={faviconUrl}
          alt={`${name} favicon`}
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
