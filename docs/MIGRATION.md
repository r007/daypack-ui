# Migration tracker

Source of truth for porting the legacy Backpack UI components (`../backpack-ui/src/components`, 175 directories).

## Porting recipe

1. Create `src/components/<Name>/{<Name>.tsx,<Name>.test.tsx,<Name>.stories.tsx,index.ts}` (PascalCase).
2. Replace Radium style objects with `makeStyles` from `@griffel/react`; use `vars.*` tokens, never raw hex.
3. `customStyles` / style arrays → `className` (merge with `mergeClasses`).
4. `propTypes` → TS interface; keep JSDoc, it feeds Storybook docs.
5. Prefer native/CSS solutions over dependencies (see list below). Add a test for behavior, not styles.
6. Export from `src/index.ts`; port the matching story from the legacy `stories/index.jsx`.

## Legacy dependency fate

| Legacy | Plan |
| --- | --- |
| radium | Griffel |
| jquery, clipboard, no-scroll, js-cookie | native APIs (`navigator.clipboard`, CSS `overflow`, `document.cookie`) |
| moment, react-moment-proptypes, react-dates, react-date-range | `Intl` / `date-fns`; calendar needs a decision |
| lodash | native or tiny inline helpers |
| react-motion*, react-tether, react-portal, react-modal | CSS transitions, `createPortal`, `<dialog>`, CSS anchor positioning / Floating UI |
| react-slick / slick-carousel, react-photoswipe | evaluate Embla / native scroll-snap; PhotoSwipe v5 |
| react-waypoint, react-stickynode, react-measure | `IntersectionObserver`, `position: sticky`, `ResizeObserver` |
| leaflet | keep (peer/optional) for `InteractiveMap`/`StaticMap`, or MapLibre |
| react-router-dom | none; links take `href` / a render-prop |
| @lonelyplanet/lp-analytics, react-recaptcha | drop (company-internal / dead) |

## Conventions learned so far

- **Media queries:** Griffel orders `@media` rules by string comparison, so overlapping mobile-first queries don't cascade. Use `media({ minWidth, below })` with *non-overlapping* ranges (see `Container`, `GridColumn`).
- **Dynamic values** (e.g. grid widths): set CSS custom properties inline and reference them from a static class.
- **Polymorphism:** no router dependency; `Link` takes `as={RouterLink}`.
- **Icons:** named `<Name>Icon` (avoids shadowing globals such as `Map`). Generated from the legacy set; Lonely Planet and partner (Booking.com, Viator, …) brand marks were intentionally dropped.
- **Form controls** are thin styles over native elements (`<input>`, `<select>`); the legacy fake-checkbox/`onClick({checked})` APIs became standard `onChange`.
- **Formatting:** prices use `Intl.NumberFormat`; no moment/lodash.

## Status

Done (26): `Avatar`, `Bullet`, `Button`, `Container`, `GridRow`, `GridColumn`, `Heading`, `Icon` (139 icons), `Lede`, `Link`, `Placeholder`, `Price`, `Rating`, `Tag`, `TextHeading`, `TextSuper`, `TextBodyArticle`, `TextBodyArticleSmall`, `TextBodySmall`, `TextAccent`, `TextUppercase`, `VisuallyHidden`, `Input`, `Textarea`, `Checkbox` (also radio), `Switch`, `Dropdown`.

Next suggested batches (dependency-free, high reuse):
1. ~~Primitives~~ ✔
2. ~~Form~~ ✔ except `Typeahead` (845 lines, tokenizer + combobox; needs a deliberate ARIA combobox rewrite) and the `SettingBlock*` family
3. Layout / content: `Card*`, `ListItem*`, `Breadcrumbs`, `Tabs`, `Accordion`, `Navigation`
4. Overlay: `Modal`, `Dialog`, `Tooltip`, `Toast`, `Flyout`
5. Heavy / third-party: carousels, galleries, maps, calendars, video

Everything else: see the legacy `src/components` directory listing.
