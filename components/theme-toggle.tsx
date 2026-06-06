"use client";

import { useSyncExternalStore } from "react";

type ThemeMode = "dark" | "light";

function applyTheme(nextTheme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", nextTheme);
  window.localStorage.setItem("aiverse-theme", nextTheme);
  window.dispatchEvent(new CustomEvent("aiverse-theme-change"));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("aiverse-theme-change", onStoreChange);
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("aiverse-theme-change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): ThemeMode {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function getServerSnapshot(): ThemeMode {
  return "dark";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function handleToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={handleToggle}
      className="theme-toggle group inline-flex items-center gap-2 rounded-full border px-2 py-2 text-xs font-medium transition sm:gap-3 sm:px-3 sm:text-sm"
    >
      <span
        suppressHydrationWarning
        className="theme-toggle__label min-w-0 text-left sm:min-w-12"
      >
        {theme === "light" ? "Light" : "Dark"}
      </span>
      <span
        aria-hidden="true"
        className={`theme-toggle__track relative inline-flex h-6 w-10 items-center rounded-full transition sm:h-7 sm:w-12 ${
          theme === "light" ? "theme-toggle__track--light" : "theme-toggle__track--dark"
        }`}
      >
        <span
          className={`theme-toggle__thumb absolute h-4 w-4 rounded-full transition sm:h-5 sm:w-5 ${
            theme === "light"
              ? "translate-x-5 bg-white sm:translate-x-6"
              : "translate-x-1 bg-[#020617]"
          }`}
        />
      </span>
    </button>
  );
}
