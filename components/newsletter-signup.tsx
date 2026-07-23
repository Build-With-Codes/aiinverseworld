"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

export function NewsletterSignup() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <p className="text-body-lg text-text-primary">
        Thanks — we'll let you know when the AiverseWorld newsletter launches.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        aria-label="Email address"
        className="w-full min-w-0 flex-1 rounded-pill border border-border-subtle bg-surface-1 px-5 py-3 text-sm text-text-primary outline-none focus:border-border-accent"
      />
      <Button type="submit" variant="primary" size="md" className="shrink-0">
        Notify me
      </Button>
    </form>
  );
}
