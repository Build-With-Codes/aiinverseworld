export function getHints(answer: string, category: string, elapsedSeconds: number) {
  const hints: string[] = [];

  if (elapsedSeconds >= 20) {
    hints.push(`Category: ${category}`);
  }

  if (elapsedSeconds >= 40) {
    hints.push(`First letter: ${answer.charAt(0).toUpperCase()}`);
  }

  if (elapsedSeconds >= 55) {
    hints.push(`Word length: ${answer.replace(/\s+/g, "").length}`);
  }

  return hints;
}
