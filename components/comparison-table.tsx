import type { Tool } from "@/lib/site-data";

type ComparisonTableProps = {
  left: Tool;
  right: Tool;
};

const rows = [
  { label: "Category", key: "category" },
  { label: "Free Tier", key: "free" },
  { label: "Starting Price", key: "startingPrice" },
  { label: "Description", key: "description" },
  { label: "Best For", key: "useCases" },
  { label: "Website", key: "website" },
];

function readValue(tool: Tool, key: string) {
  const value = tool[key as keyof Tool];

  if (Array.isArray(value)) {
    return value.slice(0, 3).join(", ");
  }

  if (typeof value === "number") {
    return value.toFixed(1);
  }

  if (key === "website" && typeof value === "string") {
    return value.replace(/^https?:\/\//, "");
  }

  return value;
}

export function ComparisonTable({ left, right }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/6 backdrop-blur-xl">
      <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-px bg-white/10">
        <div className="bg-[#091120] p-5 text-sm font-semibold text-slate-400">
          Comparison Area
        </div>
        <div className="bg-[#091120] p-5 text-lg font-semibold text-white">
          {left.name}
        </div>
        <div className="bg-[#091120] p-5 text-lg font-semibold text-white">
          {right.name}
        </div>

        {rows.map((row) => (
          <div key={row.label} className="contents">
            <div
              className="bg-[#08101d] p-5 text-sm font-medium text-slate-300"
            >
              {row.label}
            </div>
            <div className="bg-[#08101d] p-5 text-sm leading-6 text-slate-200">
              {readValue(left, row.key)}
            </div>
            <div className="bg-[#08101d] p-5 text-sm leading-6 text-slate-200">
              {readValue(right, row.key)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
