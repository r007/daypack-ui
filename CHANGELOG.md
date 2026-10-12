# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Project foundations: Vite library build, TypeScript, Griffel, Vitest, Storybook, GitHub Actions (CI + Pages).
- Design tokens and CSS-variable theming (`vars`, `ThemeProvider`).
- Components: `Button`, `Heading`, `Tag`, `Avatar`, `Icon` (139 icons), `Text*`, `Link`, `Container`, `GridRow`/`GridColumn`, `Bullet`, `Lede`, `Placeholder`, `Price`, `Rating`, `VisuallyHidden`, `Input`, `Textarea`, `Checkbox`, `Switch`, `Dropdown`, `Badge`, `Breadcrumbs`, `Accordion`, `Tabs`, `SectionNav`, `Card*`, `ListItem*`, `Dialog`, `Tooltip`, `Popover`, `Toast`/`ToastProvider`/`useToast`, `SectionHeader`, `PageHeader`, `Strapline`, `IconButton`, `MoreLink`, `DotLoader`, `Spinner`, `EmptyState`, `NumberList`, `Banner`, `Timestamp`, `LastUpdated`, `TagList`.
- `createRenderer()`: Griffel renderer with numeric (mobile-first) `@media` ordering.
- Style utilities: `typography`, `media`, `blueLink`, `underlinedLink`, `visuallyHidden`, `focusRing`.

### Changed
- `Tag`: `selected` is now opt-in. Without it a clickable tag is a plain action button; with it, a toggle announced as pressed. Extra HTML attributes are forwarded.

### Notes
- Rewritten from scratch from the legacy Backpack UI 4.x code base; history intentionally not carried over.
