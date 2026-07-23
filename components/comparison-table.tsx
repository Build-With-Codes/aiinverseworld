import type { AITool } from "@/lib/catalog-types";

type ComparisonTableProps = {
  tools: AITool[];
  highlightDifferences?: boolean;
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

export function ComparisonTable({ tools, highlightDifferences = false }: ComparisonTableProps) {
  if (tools.length < 2) return null;

  return (
    <div className="no-scrollbar overflow-x-auto rounded-card-lg border border-border-subtle bg-surface-2 backdrop-blur-xl">
      <div
        className="grid gap-px bg-border-subtle"
        style={{ gridTemplateColumns: `1.1fr repeat(${tools.length}, 1fr)` }}
      >
        <div className="bg-surface-1 p-5 text-sm font-semibold text-text-muted">Comparison Area</div>
        {tools.map((tool) => (
          <div key={tool.slug} className="bg-surface-1 p-5 text-lg font-semibold text-text-primary">
            {tool.name}
          </div>
        ))}

        {rows.map((row) => {
          const values = tools.map((tool) => readValue(tool, row.key));
          const differs =
            highlightDifferences && new Set(values).size > 1;
          const cellBg = differs ? "bg-brand-cyan/5" : "bg-surface-2";

          return (
            <div key={row.label} className="contents">
              <div className={`${cellBg} p-5 text-sm font-medium text-text-secondary`}>
                {differs ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span aria-hidden className="text-brand-cyan-strong">•</span>
                    {row.label}
                  </span>
                ) : (
                  row.label
                )}
              </div>
              {values.map((value, index) => (
                <div
                  key={`${row.label}-${tools[index].slug}`}
                  className={`text-body ${cellBg} p-5 text-text-secondary`}
                >
                  {value}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
