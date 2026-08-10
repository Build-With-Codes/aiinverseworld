"use client";

import { useEffect, useState } from "react";

type ThemeMode = "dark" | "light";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  const stored = window.localStorage.getItem("aiverse-theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (stored === "light" || stored === "dark"
    ? stored
    : systemDark
    ? "dark"
    : "light") as ThemeMode;
}

function applyTheme(nextTheme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", nextTheme);
  window.localStorage.setItem("aiverse-theme", nextTheme);
  window.dispatchEvent(new CustomEvent("aiverse-theme-change"));
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>(() =>
    typeof window === "undefined" ? "dark" : getInitialTheme(),
  );
  const [mounted, setMounted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!mounted) return;

    const handleChange = () => {
      const current = document.documentElement.getAttribute("data-theme") as ThemeMode;
      if (current) setTheme(current);
    };

    window.addEventListener("aiverse-theme-change", handleChange);

    return () => {
      window.removeEventListener("aiverse-theme-change", handleChange);
    };
  }, [mounted]);

  if (!mounted) return null;

  function handleToggle() {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      aria-label={`${theme === "light" ? "Light" : "Dark"} theme, switch to ${theme === "light" ? "dark" : "light"}`}
      onClick={handleToggle}
      className="theme-toggle group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-2 py-2 text-xs font-medium transition hover:border-border-accent hover:bg-brand-cyan/10 hover:text-text-primary sm:gap-3 sm:px-3 sm:text-sm"
    >
      <span className="theme-toggle__label min-w-0 text-left sm:min-w-12">
        {theme === "light" ? "Light" : "Dark"}
      </span>

      <span
        aria-hidden="true"
        className={`theme-toggle__track relative inline-flex h-6 w-10 items-center rounded-full transition sm:h-7 sm:w-12 ${
          theme === "light"
            ? "theme-toggle__track--light"
            : "theme-toggle__track--dark"
        }`}
      >
        <span
          className={`theme-toggle__thumb absolute h-4 w-4 rounded-full transition sm:h-5 sm:w-5 ${
            theme === "light"
              ? "translate-x-5 bg-white sm:translate-x-6"
              : "translate-x-1 bg-surface-1"
          }`}
        />
      </span>
    </button>
  );
}
