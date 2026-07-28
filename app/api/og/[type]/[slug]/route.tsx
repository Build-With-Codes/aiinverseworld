import { ImageResponse } from "next/og";

export const runtime = "edge";

const typeLabels: Record<string, string> = {
  tool: "AI Tool",
  blog: "AI Guide",
  category: "AI Category",
  compare: "AI Comparison",
  best: "Best AI Tools",
  collection: "AI Collection",
  problem: "AI Problem",
  prompt: "AI Prompt",
  prompts: "Prompt Workspace",
  job: "AI Job",
  jobs: "AI Jobs",
  search: "AiverseWorld Search",
};

function clean(value: string | null, fallback: string) {
  const text = value?.replace(/\s+/g, " ").trim();
  return text || fallback;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> },
) {
  const { type } = await params;
  const url = new URL(request.url);
  const title = clean(url.searchParams.get("title"), "AiverseWorld");
  const description = clean(
    url.searchParams.get("description"),
    "Discover, compare, and use AI tools, prompts, jobs, and practical guides.",
  );
  const kicker = clean(url.searchParams.get("kicker"), typeLabels[type] ?? "AiverseWorld");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 78% 16%, rgba(99,102,241,0.55), transparent 30%), radial-gradient(circle at 14% 82%, rgba(14,165,233,0.38), transparent 34%), linear-gradient(135deg, #050816 0%, #0b1020 48%, #111827 100%)",
          color: "white",
          padding: 68,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 800 }}>AiverseWorld</div>
            <div style={{ fontSize: 18, color: "#a5b4fc" }}>{kicker}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 940 }}>
          <div
            style={{
              width: "fit-content",
              display: "flex",
              borderRadius: 999,
              border: "1px solid rgba(165,180,252,0.38)",
              background: "rgba(15,23,42,0.72)",
              color: "#c4b5fd",
              padding: "12px 20px",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              fontSize: title.length > 64 ? 58 : 68,
              lineHeight: 1.02,
              letterSpacing: 0,
              fontWeight: 900,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#cbd5e1", maxWidth: 880 }}>
            {description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#93c5fd",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          <span>AI tools, prompts, jobs, books, and guides</span>
          <span>aiverseworld.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
