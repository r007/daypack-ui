# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Project foundations: Vite library build, TypeScript, Griffel, Vitest, Storybook, GitHub Actions (CI + Pages).
- Design tokens and CSS-variable theming (`vars`, `ThemeProvider`); style utilities `typography`, `media`, `blueLink`, `underlinedLink`, `visuallyHidden`, `focusRing`.
- `createRenderer()`: Griffel renderer with numeric (mobile-first) `@media` ordering.
- **Foundations & text:** `Heading`, `TextHeading`, `TextSuper`, `TextBody*`, `TextAccent`, `TextUppercase`, `Lede`, `Strapline`, `Prose`, `Bullet`, `BulletList`, `DisclaimerText`, `EditLink`, `TextBubble`, `VisuallyHidden`.
- **Layout:** `Container`, `GridRow`, `GridColumn`, `Section`, `TileGrid`, `HideAt`, `Masthead`, `GradientOverlay`, `PageHeader`, `SectionHeader`.
- **Actions:** `Button`, `IconButton`, `Link`, `MoreLink`, `BookmarkButton`, `ShareButtons`, `ShareMenu`, `SocialLoginButton`, `ScrollIndicator`.
- **Forms:** `Field`, `Input`, `Textarea`, `Checkbox`, `Switch`, `Dropdown`, `NumberInput`, `Slider`, `RangeSlider`, `DateField`, `DateRangeField`, `Calendar`, `Combobox`, `SegmentedControl`, `SettingGroup`, `SettingRow`, `AvatarUpload`, `NewsletterSignup`.
- **Navigation:** `Tabs`, `SectionNav`, `Breadcrumbs`, `Pagination`, `Stepper`, `Accordion`, `Disclosure`.
- **Content:** `Card*`, `ListItem*`, `Callout`, `IconCallout`, `TagList`, `Tag`, `Badge`, `Price`, `PriceRange`, `Rating`, `AmenityList`, `ContactBar`, `ProfileHeader`, `ReadMore`, `Byline`, `Timestamp`, `LastUpdated`, `Avatar`, `Placeholder`.
- **Overlays & feedback:** `Dialog`, `Popover`, `Tooltip`, `Toast`, `ToastProvider`, `useToast`, `Banner`, `DotLoader`, `Spinner`, `EmptyState`.
- **Media:** `Image`, `Carousel`, `PhotoGallery`, `Lightbox`, `Video`, `StaticMap`, `InteractiveMap` (optional Leaflet peer), `MapMarker`, `Icon` + 139 icons.
- `docs/MIGRATION.md` with the complete legacy → new component mapping.

### Changed (relative to Backpack UI)
- `linkPrimary` darkened from `#297cbb` to `#2979b7` to reach WCAG AA contrast (4.65:1); pale gray text now uses `textLight`.
- `Tag`: `selected` is opt-in; a clickable tag without it is a plain action button.
- Toast colors use dark text on blue/green/yellow for contrast.

### Notes
- Rewritten from scratch from the legacy Backpack UI 4.x code base; history intentionally not carried over.
- Lonely Planet and partner branding, ad slots and app-specific auth flows were intentionally not carried over.
