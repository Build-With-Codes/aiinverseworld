export function calculateScore({
  totalParts,
  revealedParts,
  elapsedSeconds,
  hintsUsed,
}: {
  totalParts: number;
  revealedParts: number;
  elapsedSeconds: number;
  hintsUsed: number;
}) {
  const revealPenalty = Math.round((revealedParts / Math.max(totalParts, 1)) * 450);
  const timePenalty = Math.min(250, elapsedSeconds * 2);
  const hintPenalty = hintsUsed * 100;

  return Math.max(50, 1000 - revealPenalty - timePenalty - hintPenalty);
}
