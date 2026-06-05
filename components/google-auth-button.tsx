"use client";

import { signIn, signOut } from "next-auth/react";

type GoogleSignInButtonProps = {
  callbackUrl: string;
  className?: string;
  label?: string;
};

type GoogleSignOutButtonProps = {
  callbackUrl?: string;
  className?: string;
  label?: string;
};

export function GoogleSignInButton({
  callbackUrl,
  className,
  label = "Sign In with Google",
}: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl })}
      className={className}
    >
      {label}
    </button>
  );
}

export function GoogleSignOutButton({
  callbackUrl = "/",
  className,
  label = "Sign Out",
}: GoogleSignOutButtonProps) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl })}
      className={className}
    >
      {label}
    </button>
  );
}
