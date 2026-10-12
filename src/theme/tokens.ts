/**
 * Design tokens. Values are carried over from the original Backpack UI design
 * (colors, type scale, spacing, motion, z-index) and are the single source of
 * truth for both the CSS variables emitted by <ThemeProvider> and the
 * fallbacks baked into `vars`.
 */
export const lightTokens = {
  color: {
    // Backgrounds
    bgPrimary: '#ffffff',
    bgSecondary: '#f4fbfe',
    bgOverlay: '#000000',
    bgDark: 'rgba(0, 0, 0, 0.96)',
    bgMap: '#f1f4f6',

    // Links
    // Original was #297cbb (4.47:1 on white). Nudged darker to clear WCAG AA (4.5:1) for text and white-on-blue buttons.
    linkPrimary: '#2979b7',
    linkPrimaryHover: 'rgba(41, 121, 183, 0.7)',

    // Borders
    borderPrimary: '#e4e4e4',
    borderLight: '#bfd0d8',

    // Text
    textPrimary: '#2c3643',
    textSecondary: 'rgba(44, 54, 67, 0.7)',
    textLight: '#576576',
    textOverlay: '#ffffff',

    shadowPrimary: '#000000',

    // Accents
    accentBlue: '#88bde7',
    accentGray: '#b6c3ca',
    accentGreen: '#16c98d',
    accentOrange: '#ff882e',
    accentPink: '#ff6e8d',
    accentPurple: '#9d69c9',
    accentRed: '#da0909',
    accentYellow: '#ffc83f',

    uiGreen: '#44db5e',

    // Map / point-of-interest categories
    poiDefault: '#a8a9ae',
    poiEat: '#00ca8b',
    poiPlay: '#ffc92a',
    poiSee: '#f8324d',

    // Social brands
    socialFacebook: '#3a5999',
    socialFacebookMessenger: '#1472fb',
    socialPinterest: '#cb2027',
    socialGoogleBlue: '#557ebf',
    socialGoogleGreen: '#36a852',
    socialGoogleYellow: '#f9bc15',
    socialGoogleRed: '#ea4535',
    socialReddit: '#fc4220',
    socialTwitter: '#1da1f2',
    socialWhatsapp: '#28eb76',
    socialWeChat: '#7bb32e',
  },

  font: {
    // The original design used commercial typefaces (Benton Sans, Miller Daily)
    // which are not redistributable. Override these via a theme to bring your own.
    sans: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', Times, serif",
  },

  fontWeight: {
    light: '300',
    regular: '500',
    medium: '600',
  },

  fontSize: {
    super: '88px',
    heading1: '64px',
    heading2: '48px',
    heading3: '40px',
    heading4: '32px',
    heading5: '24px',
    heading6: '20px',
    heading7: '16px',
    heading8: '11px',
    bodyArticle: '20px',
    bodyArticleSmall: '16px',
    bodySmall: '14px',
    accent: '16px',
    uppercase: '11px',
  },

  spacing: {
    gutter: '30px',
    gutterHalf: '15px',
  },

  duration: {
    fast: '200ms',
    default: '400ms',
    slow: '800ms',
  },

  zIndex: {
    below: '-1',
    default: '1',
    popup: '4000',
    dialog: '5000',
    dropdown: '6000',
    overlay: '7000',
    menu: '8000',
    modal: '9000',
    toast: '10000',
  },
} as const;

type Widen<T> = { -readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

/** Shape of a theme: same keys as `lightTokens`, any string values. */
export type Tokens = Widen<typeof lightTokens>;
/** Deep-partial override accepted by <ThemeProvider>. */
export type ThemeOverrides = { [K in keyof Tokens]?: Partial<Tokens[K]> };

/** Non-token layout constants (cannot be CSS variables inside media queries). */
export const layout = {
  maxWidth: 1290,
  minWidth: 320,
  headerHeight: 130,
  headerHeightMobile: 50,
} as const;

/** Min-width breakpoints in px, mirroring the original `mq.min` scale. */
export const breakpoints = {
  xs: 320,
  sm: 480,
  md: 600,
  lg: 768,
  xl: 1024,
  xxl: 1200,
  max: 1290,
} as const;
