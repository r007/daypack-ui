const toEm = (px: number) => `${px / 16}em`;

export interface MediaRange {
  /** Applies at viewport widths of at least this many px. */
  minWidth?: number;
  /** Applies at viewport widths strictly below this many px. */
  below?: number;
}

/**
 * Build an `@media` query for Griffel styles.
 *
 * Griffel orders media-query rules by string comparison, not by source order,
 * so overlapping mobile-first queries do not cascade reliably. Always use
 * non-overlapping ranges (`{ minWidth: 480, below: 768 }`), never rely on a
 * later query overriding an earlier one.
 */
export function media({ minWidth, below }: MediaRange): string {
  const parts: string[] = [];
  if (minWidth != null) parts.push(`(min-width: ${toEm(minWidth)})`);
  if (below != null) parts.push(`(max-width: ${toEm(below - 1)})`);
  return `@media ${parts.join(' and ')}`;
}
