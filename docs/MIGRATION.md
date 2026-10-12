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
- **Overlays** use the Popover API / `<dialog>` where available and degrade to fixed-position elements. jsdom only exercises the fallback, so verify overlay changes in a real browser (see `Floating.tsx`).
- **Formatting:** prices use `Intl.NumberFormat`; no moment/lodash.

## Consolidations (redesigned, not ported 1:1)

| Legacy | daypack | Why |
| --- | --- | --- |
| `Card`, `CardBasic`, `CardBook`, `CardPrice`, `CardShelf*`, `CardVideo` (8 variants) | `Card` + `CardMedia`/`CardBody`/`CardTitle`/`CardText`/`CardMeta`/`CardActions` | Composition replaces variant props; one stretched link instead of 2–3 duplicate tab stops; hover state via CSS custom properties, no `<Style>` hacks |
| `ListItem`, `ListItemBookable`, `ListItemBookmark`, `ListItemImage`, `ListItemThumbnail` | `ListItem` + `ListItemMedia`/`Body`/`Title`/`Text`/`Actions` | Legacy was POI-specific (slug, DFP ad, place shape); the new one is generic |
| `Accordion` (`role=tablist` misuse) | `Accordion`/`AccordionItem` | Real disclosure pattern: `aria-expanded`, regions, arrow-key header navigation, CSS-only animation |
| `Tabs`, `Tab`, `TabPanel`, `Navigation`, `NavigationTab`, `TabbedNav` | `Tabs`/`TabList`/`Tab`/`TabPanel` | WAI-ARIA tabs: roving tabindex, arrow keys, automatic activation |
| `SectionalNav` (react-scroll + sticky node) | `SectionNav` | Real links + `position: sticky`; scroll-spy left to the app |
| `Breadcrumbs` (hard-coded lonelyplanet.com) | `Breadcrumbs` | `<nav><ol>`, `aria-current`, optional microdata |
| `CategoryLabel`, `SponsorLabel`, … | `Badge` | One tone-based label |
| `Modal`, `Dialog`, `Overlay`, `Takeover`, `react-modal`, `react-portal` | `Dialog` (native `<dialog>`) | Focus trap/restore, inert page, Esc, top layer for free; `size="fullscreen"` replaces Takeover; no portal or z-index tokens |
| `Tooltip`, `Flyout`, `react-tether`, `react-motion*` | `Tooltip` (hover/focus text), `Popover` (click panel) on the Popover API | Top layer, light dismiss, WCAG 1.4.13 (dismissible, hoverable, persistent); flip/shift positioning in ~60 lines |
| `IconButton` (15 style props, `<Style>` hover hacks), `ExpandButton` | `IconButton` (`variant`, `pressed`, required `label`) | Accessible name enforced by the type; toggle state via `aria-pressed`; expand = `variant="overlay"` + `PopOutIcon` |
| `MoreLink`, `NoResults` | `MoreLink`, `EmptyState` | Link/button chosen by `href`; copy is supplied by the app, not hard-coded |
| `Loading`, `DotLoader` | `Spinner`, `DotLoader` | `role="status"` + hidden label; reduced-motion aware |
| `TravelAlert` (`dangerouslySetInnerHTML`) | `Banner` | Children instead of HTML strings; tone → role |
| `Timestamp`, `LastUpdated` | `Timestamp`, `LastUpdated` | `<time>` with `Intl` formatting, no moment |
| `TagList` | `TagList` | `<ul>` with an `aria-expanded` "+N" toggle instead of clipping by `max-height` |
| `PageHeader` (generated "Top choice hotel in …" copy) | `PageHeader` | Slots (`eyebrow`, `heading`, `strapline`) instead of POI-specific string building |
| `Toast` (props-driven) | `Toast` + `ToastProvider`/`useToast` | Live regions (`alert` vs `status`), pause-on-hover timers, AA contrast per type |

## Status

Done (60): `Avatar`, `Bullet`, `Button`, `Container`, `GridRow`, `GridColumn`, `Heading`, `Icon` (139 icons), `Lede`, `Link`, `Placeholder`, `Price`, `Rating`, `Tag`, `TextHeading`, `TextSuper`, `TextBodyArticle`, `TextBodyArticleSmall`, `TextBodySmall`, `TextAccent`, `TextUppercase`, `VisuallyHidden`, `Input`, `Textarea`, `Checkbox` (also radio), `Switch`, `Dropdown`, `Badge`, `Breadcrumbs`, `Accordion`, `Tabs`, `SectionNav`, `Card*`, `ListItem*`, `Dialog`, `Tooltip`, `Popover`, `Toast` (+ `ToastProvider`/`useToast`), `SectionHeader`, `PageHeader`, `Strapline`, `IconButton`, `MoreLink`, `DotLoader`, `Spinner`, `EmptyState`, `NumberList`/`NumberMarker`, `Banner`, `Timestamp`/`LastUpdated`, `TagList`.

Next suggested batches (dependency-free, high reuse):
1. ~~Primitives~~ ✔
2. ~~Form~~ ✔ except `Typeahead` (845 lines, tokenizer + combobox; needs a deliberate ARIA combobox rewrite) and the `SettingBlock*` family
3. ~~Layout / content~~ ✔ (see "Consolidations" below). Remaining: `ArticlePreview`, `Callout*`, `ContentBlock`, `PageHeader`, `ProfileHeader`, `Masthead`, `Toolbar`, `Flyout` …
4. ~~Overlay~~ ✔ — see "Consolidations". `ModalContent*` (login/magic-link forms) were app-specific and are intentionally not ported
5. Heavy / third-party: carousels, galleries, maps, calendars, video. **Policy (from the maintainer): lightweight, accessible, modern.** Native first (scroll-snap carousels, `<dialog>` lightbox, `<input type=date>`/small own calendar, `<video>`/`<details>`); only add a package when native cannot do it, keep it an *optional peer*, and prefer small a11y-first libraries (Leaflet over MapLibre for simple maps).
6. Still to look at: `ContentBlock`, `ContentHeader`, `ContentSectionList`, `Narrative`, `Segment`, `SidebarSection`, `ProfileHeader`, `ProfileIntro`, `Newsletter`, `Callout*`, `FeaturedCallout`, `IconCallout*`, `Masthead*`, `Toolbar`, `ContactBar`, `Author*`

Everything else: see the legacy `src/components` directory listing.
