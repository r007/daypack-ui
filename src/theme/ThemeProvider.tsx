import * as React from 'react';
import { themeToCssVars } from './vars';
import type { ThemeOverrides } from './tokens';

export interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Token overrides. Anything omitted falls back to the default (light) theme. */
  theme?: ThemeOverrides;
}

/**
 * Scopes theme overrides to a subtree by setting CSS custom properties.
 * Rendering without a provider is fine: components fall back to the defaults.
 */
export function ThemeProvider({ theme, style, children, ...rest }: ThemeProviderProps) {
  const cssVars = React.useMemo(() => (theme ? themeToCssVars(theme) : {}), [theme]);
  return (
    <div style={{ ...cssVars, ...style }} {...rest}>
      {children}
    </div>
  );
}
