import { lightTokens, type Tokens } from './tokens';

const PREFIX = 'dp';

const kebab = (s: string) => s.replace(/[A-Z0-9]/g, (m) => `-${m.toLowerCase()}`);

/** CSS custom-property name for a token, e.g. `color`/`linkPrimary` → `--dp-color-link-primary`. */
export const cssVarName = (group: string, key: string) =>
  `--${PREFIX}-${kebab(group)}-${kebab(key)}`;

type VarMap = { [G in keyof Tokens]: { [K in keyof Tokens[G]]: string } };

/**
 * `vars.color.linkPrimary` === `var(--dp-color-link-primary, #2979b7)`.
 * Components use these in Griffel styles, so they work with or without a
 * <ThemeProvider> and can be re-themed at any DOM level.
 */
export const vars = Object.fromEntries(
  Object.entries(lightTokens).map(([group, values]) => [
    group,
    Object.fromEntries(
      Object.entries(values).map(([key, value]) => [
        key,
        `var(${cssVarName(group, key)}, ${value})`,
      ]),
    ),
  ]),
) as VarMap;

/** Flatten a (partial) theme into `{ '--dp-…': value }` for use as inline style. */
export function themeToCssVars(
  theme: { [G in keyof Tokens]?: Partial<Tokens[G]> },
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [group, values] of Object.entries(theme)) {
    for (const [key, value] of Object.entries(values ?? {})) {
      if (value != null) out[cssVarName(group, key)] = String(value);
    }
  }
  return out;
}
