import { render } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { vars, cssVarName } from './vars';

describe('theme', () => {
  it('vars carry a fallback value', () => {
    expect(vars.color.linkPrimary).toBe('var(--dp-color-link-primary, #2979b7)');
  });

  it('ThemeProvider sets CSS custom properties', () => {
    const { container } = render(
      <ThemeProvider theme={{ color: { linkPrimary: '#f00' } }}>x</ThemeProvider>,
    );
    expect((container.firstChild as HTMLElement).style.getPropertyValue(cssVarName('color', 'linkPrimary'))).toBe('#f00');
  });
});
