import { createDOMRenderer, type GriffelRenderer } from '@griffel/react';
import { compareCSSQueries } from '@griffel/sort-css-queries';

/**
 * Griffel orders `@media` buckets with a plain string comparison, so
 * `(min-width: 1024px)` is inserted *before* `(min-width: 480px)` and
 * mobile-first rules silently stop cascading. This renderer orders queries
 * numerically instead (min-width ascending, max-width descending).
 *
 * daypack components never depend on it (they use non-overlapping `media()`
 * ranges), but you need it if you write overlapping mobile-first queries in
 * your own `makeStyles` calls:
 *
 * ```tsx
 * import { RendererProvider } from '@griffel/react';
 * const renderer = createRenderer();
 * <RendererProvider renderer={renderer} targetDocument={document}>…</RendererProvider>
 * ```
 */
export function createRenderer(targetDocument?: Document): GriffelRenderer {
  return createDOMRenderer(targetDocument, {
    compareMediaQueries: compareCSSQueries,
    compareContainerQueries: compareCSSQueries,
  });
}
