import type { AITool } from "@/lib/site-data";

type ComparisonTableProps = {
  left: AITool;
  right: AITool;
};

const rows: { label: string; key: keyof AITool }[] = [
  { label: "Category", key: "category" },
  { label: "Subcategory", key: "subcategory" },
  { label: "Company", key: "company" },
  { label: "Pricing Model", key: "pricingModel" },
  { label: "Starting Price", key: "startingPriceUsd" },
  { label: "Free Plan", key: "freePlan" },
  { label: "Free Trial", key: "freeTrial" },
  { label: "Platforms", key: "platforms" },
  { label: "Modalities", key: "modalities" },
  { label: "AI Type", key: "aiType" },
  { label: "API Available", key: "apiAvailable" },
  { label: "Open Source", key: "openSource" },
  { label: "Deployment", key: "deploymentType" },
  { label: "Team Collaboration", key: "teamCollaboration" },
  { label: "Best For", key: "bestFor" },
  { label: "Target Audience", key: "targetAudience" },
  { label: "Status", key: "status" },
  { label: "Launch Year", key: "launchYear" },
];

function readValue(tool: AITool, key: keyof AITool) {
  const value = tool[key];

  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ") || "—";
  if (value === null || value === undefined) return "—";
  if (key === "startingPriceUsd") return value === 0 ? "Free" : `$${value}/mo`;
  return String(value);
}

export function ComparisonTable({ left, right }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/6 backdrop-blur-xl">
      <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-px bg-white/10">
        <div className="bg-[#091120] p-5 text-sm font-semibold text-slate-400">Comparison Area</div>
        <div className="bg-[#091120] p-5 text-lg font-semibold text-white">{left.name}</div>
        <div className="bg-[#091120] p-5 text-lg font-semibold text-white">{right.name}</div>

        {rows.map((row) => (
          <div key={row.label} className="contents">
            <div className="bg-[#08101d] p-5 text-sm font-medium text-slate-300">{row.label}</div>
            <div className="bg-[#08101d] p-5 text-sm leading-6 text-slate-200">{readValue(left, row.key)}</div>
            <div className="bg-[#08101d] p-5 text-sm leading-6 text-slate-200">{readValue(right, row.key)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
