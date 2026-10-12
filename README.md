# daypack-ui

A React + TypeScript component library, styled with [Griffel](https://griffel.js.org/) (atomic, build-time-friendly CSS-in-JS) and themed with CSS custom properties.

The visual design descends from **Backpack UI**, an open-source (MIT) component library originally created by [Lonely Planet](https://www.lonelyplanet.com/). This is an independent rewrite and is not affiliated with or endorsed by Lonely Planet.

> **Status: early.** The foundations (tokens, theming, build, tests, Storybook, CI) are in place and a first batch of components is ported. See [docs/MIGRATION.md](docs/MIGRATION.md) for what remains.

## Install

```sh
pnpm add daypack-ui
```

Peer dependencies: `react` and `react-dom` ≥ 18. Styles are injected at runtime by Griffel; no CSS import is needed.

## Usage

```tsx
import { Button, Heading, ThemeProvider } from 'daypack-ui';

<ThemeProvider theme={{ color: { linkPrimary: '#0f766e' } }}>
  <Heading level={1} size="huge">Where to next?</Heading>
  <Button href="/plan" rounded>Plan a trip</Button>
</ThemeProvider>;
```

### Theming

All design tokens (colors, fonts, type scale, spacing, motion, z-index) are exposed as CSS custom properties named `--dp-<group>-<token>`, each with a built-in fallback, so components work with no provider at all. `<ThemeProvider theme={...}>` overrides any subset for a subtree. You can also set the variables yourself in plain CSS.

### Fonts

The original design used the commercial typefaces Benton Sans and Miller Daily, which are not included. The default stack is a system sans/serif; set `font.sans` / `font.serif` in a theme to supply your own.

## Differences from Backpack UI

- TypeScript, typed props instead of `propTypes`.
- Griffel instead of Radium; the `customStyles` / `style`-array props are replaced by `className` (and `style` where sensible).
- Focus uses a visible `:focus-visible` ring instead of a dotted outline.
- Dropped jQuery, Moment, lodash, `react-router` coupling and other legacy dependencies; each ported component documents any remaining third-party dependency.

## Development

```sh
pnpm install
pnpm dev              # Storybook on :6006
pnpm test             # Vitest + Testing Library
pnpm typecheck && pnpm lint
pnpm build            # library → dist/
pnpm build:storybook  # static docs → storybook-static/
```

Storybook is deployed to GitHub Pages by `.github/workflows/storybook.yml` on every push to `main` (enable *Settings → Pages → Source: GitHub Actions*).

## License

[MIT](LICENSE). Includes the original copyright notice of Lonely Planet, as the MIT license requires for derived work.
