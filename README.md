# daypack-ui

A React + TypeScript component library built on [Griffel](https://griffel.js.org/)
(atomic CSS-in-JS) and CSS-variable theming. Accessible by default, native-first
and light on dependencies.

The visual design descends from **Backpack UI**, an open-source (MIT) component
library originally created by [Lonely Planet](https://www.lonelyplanet.com/).
This is an independent rewrite: new code, new APIs, new accessibility model. It
is not affiliated with or endorsed by Lonely Planet.

- **~90 components**: layout, text, forms, navigation, overlays, media, maps
- **Accessible**: native elements, ARIA patterns, keyboard support, AA contrast, reduced-motion
- **Themeable**: every token is a `--dp-*` CSS variable with a built-in fallback
- **Light**: only `@griffel/react` at runtime; Leaflet is an optional, lazy-loaded peer
- **Typed and documented**: strict TypeScript, JSDoc on every prop, Storybook docs

## Install

```sh
pnpm add daypack-ui
```

Peer dependencies: `react` and `react-dom` ≥ 18. Optional: `leaflet` (only for
`InteractiveMap`). Styles are injected at runtime by Griffel, so no CSS import
is needed.

## Use

```tsx
import { Button, Card, CardBody, CardMedia, CardTitle, ThemeProvider } from 'daypack-ui';

export function Example() {
  return (
    <ThemeProvider theme={{ color: { linkPrimary: '#0f766e' } }}>
      <Card>
        <CardMedia src="/paris.jpg" alt="" />
        <CardBody>
          <CardTitle href="/paris">Paris in three days</CardTitle>
        </CardBody>
      </Card>
      <Button href="/plan" rounded>Plan a trip</Button>
    </ThemeProvider>
  );
}
```

### What is in the box

| Area | Components |
| --- | --- |
| Foundations | `ThemeProvider`, tokens (`vars`, `lightTokens`), `typography`, `media`, `createRenderer` |
| Layout | `Container`, `GridRow`/`GridColumn`, `Section`, `TileGrid`, `HideAt`, `Masthead` |
| Text | `Heading`, `TextHeading`, `TextBody*`, `Prose`, `Lede`, `Strapline`, `PageHeader`, `SectionHeader`, `Byline` |
| Actions | `Button`, `IconButton`, `Link`, `MoreLink`, `BookmarkButton`, `ShareButtons`, `ShareMenu`, `SocialLoginButton` |
| Forms | `Field`, `Input`, `Textarea`, `Checkbox`/radio, `Switch`, `Dropdown`, `NumberInput`, `Slider`, `RangeSlider`, `DateField`, `Calendar`, `Combobox`, `SegmentedControl`, `SettingRow`, `AvatarUpload`, `NewsletterSignup` |
| Navigation | `Tabs`, `SectionNav`, `Breadcrumbs`, `Pagination`, `Stepper`, `Accordion`, `Disclosure` |
| Content | `Card*`, `ListItem*`, `Callout`, `IconCalloutGroup`, `TagList`/`Tag`, `Badge`, `Price`, `PriceRange`, `Rating`, `AmenityList`, `ContactBar`, `ProfileHeader`, `ReadMore`, `Timestamp` |
| Overlays & feedback | `Dialog`, `Popover`, `Tooltip`, `Toast`/`useToast`, `Banner`, `DotLoader`, `Spinner`, `EmptyState` |
| Media | `Image`, `Carousel`, `PhotoGallery`/`Lightbox`, `Video`, `StaticMap`, `InteractiveMap`, `MapMarker`, `Icon` (139 icons) |

Browse them, with controls and props tables, in Storybook (`pnpm dev`).

## Theming

All design tokens (colors, fonts, type scale, spacing, motion, z-index) are
exposed as CSS custom properties named `--dp-<group>-<token>`, each with a
built-in fallback, so components work with no provider at all.
`<ThemeProvider theme={...}>` overrides any subset for a subtree. You can also
set the variables in plain CSS.

### Fonts

The original design used the commercial typefaces Benton Sans and Miller Daily,
which are not included. The default stack is a system sans/serif; set
`font.sans` / `font.serif` in a theme to supply your own.

### Contrast

Where the original palette failed WCAG AA, tokens were adjusted minimally:
`linkPrimary` went from `#297cbb` (4.47:1) to `#2979b7` (4.65:1), and pale gray
text uses `textLight`. Override tokens as you need; the defaults are AA-safe.

## Authoring your own responsive styles

Griffel's default renderer orders `@media` rules by string comparison, so
`(min-width: 1024px)` is emitted *before* `(min-width: 480px)` and overlapping
mobile-first queries don't cascade. daypack components avoid the problem with
non-overlapping ranges (`media({ minWidth: 480, below: 768 })`). If you write
your own overlapping queries, use the bundled renderer:

```tsx
import { RendererProvider } from '@griffel/react';
import { createRenderer } from 'daypack-ui';

const renderer = createRenderer(document);
<RendererProvider renderer={renderer} targetDocument={document}>…</RendererProvider>
```

## Maps

`InteractiveMap` uses [Leaflet](https://leafletjs.com/) as an **optional peer**,
loaded on demand:

```sh
pnpm add leaflet
```

```tsx
import 'leaflet/dist/leaflet.css';
```

Without Leaflet, use `StaticMap` (a plain image) and nothing extra is loaded.

## Differences from Backpack UI

- TypeScript with typed, documented props instead of `propTypes`.
- Griffel instead of Radium; `customStyles` / style arrays became `className` and `style`.
- Variant-heavy components are consolidated into composable parts with
  accessible patterns. See [docs/MIGRATION.md](docs/MIGRATION.md) for the full
  legacy → new mapping and dropped pieces.
- Native platform features instead of libraries: `<dialog>`, Popover API,
  scroll-snap, `<input type=date>`, `<video>`, `Intl`.
- No jQuery, Moment, lodash, router coupling, or analytics.

## Development

```sh
pnpm install
pnpm dev              # Storybook on :6006
pnpm test             # Vitest + Testing Library
pnpm typecheck && pnpm lint
pnpm build            # library → dist/
pnpm build:storybook  # static docs → storybook-static/
```

Storybook is deployed to GitHub Pages by `.github/workflows/storybook.yml` on
every push to `main` (enable *Settings → Pages → Source: GitHub Actions*).

## License

[MIT](LICENSE). Includes the original copyright notice of Lonely Planet, as the
MIT license requires for derived work.
