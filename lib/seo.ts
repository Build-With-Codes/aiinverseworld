export const siteUrl = "https://aiverseworld.com";

export function buildUrl(path: string) {
  return `${siteUrl}${path === "/" ? "" : path}`;
}
