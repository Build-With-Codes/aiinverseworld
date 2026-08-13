export function compactNumber(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: value >= 10_000 ? 1 : 0,
  }).format(value);
}

export function relativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "recently";

  const diffMs = timestamp - Date.now();
  const absMs = Math.abs(diffMs);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (absMs < hour) return formatter.format(Math.round(diffMs / minute), "minute");
  if (absMs < day) return formatter.format(Math.round(diffMs / hour), "hour");
  return formatter.format(Math.round(diffMs / day), "day");
}
