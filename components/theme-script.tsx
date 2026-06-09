export function ThemeScript() {
  const script = `
    (() => {
      const stored = window.localStorage.getItem("aiverse-theme");
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = stored === "light" || stored === "dark" ? stored : systemDark ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
    })();
  `;

  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}
