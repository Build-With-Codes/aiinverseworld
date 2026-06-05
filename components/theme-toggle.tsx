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
      className="theme-toggle group inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-medium transition"
    >
      <span
        suppressHydrationWarning
        className="theme-toggle__label min-w-12 text-left"
      >
        {theme === "light" ? "Light" : "Dark"}
      </span>
      <span
        aria-hidden="true"
        className={`theme-toggle__track relative inline-flex h-7 w-12 items-center rounded-full transition ${
          theme === "light" ? "theme-toggle__track--light" : "theme-toggle__track--dark"
        }`}
      >
        <span
          className={`theme-toggle__thumb absolute h-5 w-5 rounded-full transition ${
            theme === "light" ? "translate-x-6 bg-white" : "translate-x-1 bg-[#020617]"
          }`}
        />
      </span>
    </button>
  );
}
