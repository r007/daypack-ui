# Migration from Backpack UI

The legacy library (`backpack-ui` 4.x, ~175 component directories) was used as
**inspiration**, not ported 1:1. The visual language (tokens, typography,
colors, spacing) is preserved; APIs and implementations were redesigned for
accessibility, composition and a small dependency footprint.

**Status: complete.** Every legacy component is either implemented, folded into
a more general component, or intentionally dropped (table below).

## Principles

1. **Native first.** `<dialog>`, the Popover API, `<input type=date>`,
   scroll-snap, `<video>`, `Intl`: no library when the platform does it.
2. **Accessible by construction.** Required names (`IconButton label`,
   `Carousel label`), correct roles and keyboard models (tabs, accordion,
   combobox, calendar grid), reduced-motion support, AA contrast.
3. **Composition over variants.** `Card`, `ListItem`, `Tabs`… are small parts,
   not 8 near-identical components with 40 props.
4. **Tokens everywhere.** Components read CSS variables (`--dp-*`) with
   fallbacks, so they theme without a provider.
5. **Lightweight and optional.** Third-party code is an optional peer
   (only Leaflet today) and loaded lazily.

## Conventions

- **Media queries:** Griffel orders `@media` rules by string comparison, so
  overlapping mobile-first queries do not cascade. Use `media({ minWidth, below })`
  with non-overlapping ranges. Consumers writing their own overlapping queries
  can use `createRenderer()` (numeric ordering).
- **Dynamic values** (grid widths, carousel columns): set CSS custom
  properties inline and reference them from static atomic classes.
- **Polymorphism:** no router dependency. `Link` takes `as={RouterLink}`.
- **Overlays** use the Popover API / `<dialog>` where available and degrade to
  fixed-position elements. jsdom only exercises the fallback, so verify overlay
  changes in a real browser.
- **Icons** are named `<Name>Icon` (avoids shadowing globals such as `Map`).
  Lonely Planet and partner brand marks were not carried over.
- **Doc comments:** every prop has JSDoc (type, default, behaviour); it feeds
  Storybook's controls and docs tables.

## Dependency fate

| Legacy | Replacement |
| --- | --- |
| radium | Griffel |
| jquery, clipboard, no-scroll, js-cookie | native APIs |
| moment, react-moment-proptypes, react-dates, react-date-range | `Intl` + own `Calendar`, native `<input type=date>` |
| lodash, classnames, object-assign, color | native / Griffel `mergeClasses` / CSS `color-mix` |
| react-motion*, react-tether, react-portal, react-modal | CSS transitions, top layer (`<dialog>`, Popover API) |
| react-slick, slick-carousel, react-photoswipe | own `Carousel` (scroll-snap), `Lightbox` (`<dialog>`) |
| react-waypoint, react-stickynode, react-measure | `IntersectionObserver`, `position: sticky`, `ResizeObserver` |
| react-router-dom | none (`Link as={…}`) |
| react-validate-form, react-recaptcha | `Field` + app-level validation; captcha via `children` slot |
| react-markdown-renderer | `Prose` (render Markdown in your app) |
| leaflet | kept, as an **optional peer**, lazy-loaded by `InteractiveMap` |
| @lonelyplanet/lp-analytics, axios, haversine, fuzzy, truncate | dropped (application concerns) |

## Component mapping

| Legacy | daypack-ui |
| --- | --- |
| `accordion` | Accordion, AccordionItem |
| `adLazyLoader` | dropped (Google DFP ad slot) |
| `ad` | dropped (Google DFP ad slot) |
| `albumThumbnailImage` | → Image |
| `amenities` | AmenityList |
| `articleAuthor` | → Byline |
| `articlePaginationItem` | → Pagination |
| `articlePaginationNav` | → Pagination |
| `articlePreview` | → Card |
| `auth` | dropped (app-specific auth flow) |
| `authorName` | → Byline |
| `author` | → Byline |
| `availability` | → Calendar + Price |
| `avatarMarker` | → Avatar / MapMarker |
| `avatarUpload` | AvatarUpload |
| `avatar` | Avatar |
| `bookmarkButtonAlt` | BookmarkButton `glyph="alt"` |
| `bookmarkButton` | BookmarkButton |
| `bookmarkListAuthor` | → Byline |
| `bookmarkListHeader` | → PageHeader |
| `bookmarkListMenu` | → Popover + list |
| `breadcrumbs` | Breadcrumbs |
| `bulletDescription` | BulletList |
| `bullet` | Bullet |
| `button` | Button |
| `calendar` | Calendar |
| `calloutLink` | → Callout |
| `callout` | Callout |
| `cardBasic` | → Card |
| `cardBook` | → Card (+ Price) |
| `cardPrice` | → Card + Price |
| `cardShelfVideoSlider` | → Carousel |
| `cardShelfVideoSwiper` | → Carousel |
| `cardShelfVideo` | → Carousel of Cards + Video |
| `cardShelf` | → Carousel of Cards |
| `cardVideo` | → Card + Video |
| `card` | Card, CardMedia, CardBody, CardTitle, CardText, CardMeta, CardActions |
| `categoryLabelLink` | → Badge inside a link |
| `categoryLabel` | → Badge |
| `checkbox` | Checkbox |
| `contactBar` | ContactBar |
| `container` | Container |
| `contentBlock` | → Prose |
| `contentHeader` | → Section |
| `contentSectionList` | → Section |
| `coverPhoto` | → Image |
| `dialog` | Dialog |
| `disclaimerText` | DisclaimerText |
| `dotLoader` | DotLoader |
| `dropdown` | Dropdown |
| `editLink` | EditLink |
| `expandButton` | → IconButton `variant="overlay"` |
| `featuredArticle` | → Card / Callout |
| `featuredCallout` | → Callout |
| `featuredSectionHeading` | → SectionHeader |
| `flag` | → Badge |
| `flightSearchWidget` | dropped (app-specific widget; compose Field + DateRangeField + Combobox) |
| `flyout` | → Popover |
| `form` | Field, NumberInput, Slider, RangeSlider, DateField, DateRangeField |
| `gradientOverlay` | GradientOverlay |
| `gridColumn` | GridColumn |
| `gridRow` | GridRow |
| `heading` | Heading |
| `heroImageContainer` | → Masthead |
| `hideAtBreakpoint` | HideAt |
| `iconButton` | IconButton |
| `iconCalloutGroup` | IconCalloutGroup |
| `iconCallout` | IconCallout |
| `iconRevealButton` | ? |
| `iconRevealButton` | → IconButton `caption` |
| `icon` | Icon + 139 `*Icon` components |
| `imageCarousel` | → Carousel |
| `imageGallery` | → PhotoGallery / Lightbox |
| `imageHero` | → Masthead |
| `imageLoader` | → Image |
| `input` | Input |
| `interactiveMap` | InteractiveMap |
| `italicText` | → TextAccent |
| `lastUpdated` | LastUpdated |
| `lede` | Lede |
| `link` | Link |
| `listButton` | → IconButton |
| `listContainer` | → plain `<ul>` / TileGrid |
| `listItemBookable` | → ListItem + Price + Button |
| `listItemBookmarkEntry` | → ListItem + BookmarkButton |
| `listItemBookmark` | → ListItem + BookmarkButton |
| `listItemImage` | → ListItemMedia |
| `listItemNews` | → ListItem + Timestamp |
| `listItemThumbnail` | → ListItemMedia |
| `listItemWireframe` | → ListItem with `Placeholder` |
| `listItem` | ListItem, ListItemMedia, ListItemBody, ListItemTitle, ListItemText, ListItemActions |
| `loading` | Spinner |
| `locationLabel` | → Badge |
| `location` | → Breadcrumbs + ContactBar |
| `logo` | dropped (Lonely Planet branding) |
| `mapMarker` | MapMarker |
| `mastheadSlider` | → Carousel of Masthead |
| `masthead` | Masthead |
| `mobileToolbar` | → ContactBar + IconButton |
| `modalContent` | dropped (app-specific login/magic-link forms) |
| `modalLogIn` | dropped (app-specific auth flow) |
| `modal` | → Dialog |
| `moreLink` | MoreLink |
| `multiStep` | Stepper |
| `narrative` | → Prose + Byline |
| `navigation` | → Tabs / SectionNav |
| `newsArticleAuthor` | → Byline |
| `newsList` | → ListItem list |
| `newsletter` | NewsletterSignup |
| `noResults` | EmptyState |
| `numberList` | NumberList |
| `numberMarker` | NumberMarker |
| `overlay` | → Dialog backdrop (native) |
| `pageHeader` | PageHeader |
| `paginatorButton` | → Pagination |
| `photoGallery` | PhotoGallery, Lightbox |
| `placeholder` | Placeholder |
| `poiPaginator` | → Pagination |
| `priceRangeLabel` | PriceRange |
| `price` | Price |
| `profileHeader` | ProfileHeader |
| `profileIntro` | → ReadMore |
| `promotedGuidebook` | → Callout |
| `providerLogo` | dropped (third-party partner logos) |
| `rating` | Rating |
| `recommendedArticles` | → Carousel/TileGrid of Cards |
| `relatedTour` | → Callout + Price |
| `reviewedBadge` | dropped (Lonely Planet branding); use Badge |
| `scrollIndicator` | ScrollIndicator |
| `sectionHeader` | SectionHeader |
| `sectionalNav` | SectionNav |
| `segment` | → Section |
| `settingBlockAccordion` | → SettingGroup + Disclosure |
| `settingBlockAction` | → SettingRow |
| `settingBlockCheckbox` | → SettingRow + Checkbox |
| `settingBlockInput` | → SettingRow + Input |
| `settingBlockTextArea` | → SettingRow + Textarea |
| `settingBlock` | SettingGroup, SettingRow |
| `shareMenu` | ShareMenu |
| `sidebarSection` | → Disclosure / Section |
| `sightsListItem` | → ListItem + NumberMarker |
| `slideTall` | → Carousel + Card |
| `slide` | → Carousel + Masthead |
| `socialIconButton` | → ShareButtons |
| `socialLoginButton` | SocialLoginButton |
| `socialShareContainer` | → shareUrl() |
| `socialShare` | ShareButtons |
| `sponsorLabel` | → Badge |
| `spotlightZone` | → Masthead + Video |
| `staticMap` | StaticMap |
| `strapline` | Strapline |
| `switch` | Switch |
| `tabbedNav` | → Tabs / SectionNav |
| `tabs` | Tabs, TabList, Tab, TabPanel |
| `tagList` | TagList |
| `tag` | Tag |
| `takeover` | → Dialog `size="fullscreen"` |
| `tallCarousel` | → Carousel `slidesPerView` |
| `textBubble` | TextBubble |
| `text` | TextHeading, TextSuper, TextBody*, TextAccent, TextUppercase |
| `textarea` | Textarea |
| `thumbnailListItem` | → ListItem |
| `thumbnailList` | → ListItem |
| `tileGrid` | TileGrid |
| `tileVideoPoster` | → Video (poster mode) |
| `tileVideo` | → Card + Video |
| `timestamp` | Timestamp |
| `toast` | Toast, ToastProvider, useToast |
| `toolbar` | → ContactBar |
| `tooltip` | Tooltip |
| `tourItinerary` | → Stepper / NumberList |
| `travelAlert` | Banner |
| `typeSelector` | SegmentedControl |
| `typeahead` | Combobox |
| `video` | Video |
| `watchLater` | dropped (app-specific feature) |

## Dropped on purpose

Application- or brand-specific pieces that do not belong in a design system:
Lonely Planet logos and badges, partner logos, Google DFP ad slots, the
login/magic-link flow, watch-later and bookmark-list features, and the flight
search widget. Where a generic version makes sense it is a recipe in Storybook
(compose `Field`, `DateRangeField`, `Combobox`, `Button`).

## Ideas for later

- Dark theme (`ThemeProvider theme={{ color: … }}` already supports it; needs a
  curated token set and a Storybook toolbar toggle).
- Griffel ahead-of-time extraction (`@griffel/vite-plugin`) for zero-runtime CSS.
- Visual regression (Playwright + Storybook) and an axe sweep in CI.
- Publish to npm with provenance once the name is final.
