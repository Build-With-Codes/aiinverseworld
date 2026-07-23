"use client";

// Tiny dependency-free confetti burst. Honors reduced-motion. Use sparingly —
// only for meaningful moments (first save, completing a collection).
export function burstConfetti() {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const colors = ["#3b82f6", "#8b5cf6", "#22d3ee", "#67e8f9", "#a78bfa"];
  const count = 28;
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(container);

  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement("span");
    const size = 6 + Math.random() * 6;
    const left = 50 + (Math.random() - 0.5) * 40;
    const dx = (Math.random() - 0.5) * 320;
    const dy = -150 - Math.random() * 220;
    const rot = (Math.random() - 0.5) * 720;
    dot.style.cssText = `position:absolute;top:55%;left:${left}%;width:${size}px;height:${size}px;background:${
      colors[i % colors.length]
    };border-radius:2px;opacity:1;will-change:transform,opacity`;
    container.appendChild(dot);
    dot.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
          opacity: 0,
        },
      ],
      { duration: 900 + Math.random() * 500, easing: "cubic-bezier(0.16,1,0.3,1)" },
    );
  }

  window.setTimeout(() => container.remove(), 1600);
}
