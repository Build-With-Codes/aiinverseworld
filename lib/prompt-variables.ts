/** Shared with app/prompts/prompts-client.tsx's Variable Playground — kept
 * here so the individual prompt page can use the same substitution logic
 * instead of duplicating it. */
export function applyPromptVariables(promptText: string, values: Record<string, string>) {
  let output = promptText;
  for (const [key, value] of Object.entries(values)) {
    output = output.replaceAll(`{{${key}}}`, value || `{{${key}}}`);
  }
  return output;
}

export function getInitialPromptVariables(
  source?: Record<string, string> | null,
): Record<string, string> {
  return Object.fromEntries(Object.entries(source ?? {}).map(([key, value]) => [key, String(value ?? "")]));
}
