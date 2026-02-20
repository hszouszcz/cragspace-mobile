/**
 * Strava-Inspired Color Palette
 * ─────────────────────────────
 *
 * ## Design Analysis — Strava Visual Language
 *
 * Strava's UI is built around a bold, athletic identity that communicates
 * energy, achievement, and community. The design language is characterized by:
 *
 * ### Brand Colors
 * - **Strava Orange (#FC4C02)**: The hero color. Used for primary CTAs, the
 *   logo, segment crowns, KOM/QOM badges, and active tab indicators. It's warm,
 *   high-contrast, and instantly recognizable. Applied sparingly to maintain
 *   impact — never as a background fill for large areas.
 * - **Strava Gradient**: A subtle warm-to-hot gradient (orange → red-orange)
 *   used on premium features and celebration screens.
 *
 * ### Surface & Background Hierarchy
 * - **Light mode**: Pure white (#FFFFFF) for primary surfaces (cards, sheets).
 *   A cool off-white (#F7F7FA) for the page/screen background to create depth
 *   between cards and canvas. Very subtle warm gray (#F0F0F5) for inset areas,
 *   input fields, and section dividers.
 * - **Dark mode**: Near-black (#0A0A0B) for the deepest background. Elevated
 *   surfaces use #161618, then #1C1C1E for cards and sheets. This triple-layer
 *   approach mirrors iOS system dark mode conventions, giving a sense of
 *   physical elevation without using shadows.
 *
 * ### Text Colors
 * - **Primary text**: Near-black (#1D1D1F) in light mode, white (#F5F5F7) in
 *   dark mode. Used for headlines, athlete names, activity titles.
 * - **Secondary text**: Medium gray (#6E6E73) for timestamps, distances, labels.
 * - **Tertiary/muted text**: Light gray (#AEAEB2) for placeholders, disabled
 *   states, and auxiliary info.
 * - **Inverse text**: Always white, used on the orange brand buttons and badges.
 *
 * ### Semantic/Feedback Colors
 * - **Success green (#34C759)**: Kudos confirmations, completed challenges, PRs.
 * - **Warning amber (#FF9500)**: Caution states, expiring subscriptions.
 * - **Error red (#FF3B30)**: Delete confirmations, form validation errors.
 * - **Info blue (#007AFF)**: Links, informational banners.
 *
 * ### Borders & Separators
 * - Very low-opacity lines (rgba black at 6-10%) in light mode.
 * - Slightly more visible (rgba white at 8-12%) in dark mode.
 * - Cards rely on elevation (shadow) rather than borders in light mode.
 *
 * ### Shadows & Elevation
 * - Light mode cards use a subtle multi-layer shadow:
 *   Layer 1: 0 1px 3px rgba(0,0,0,0.08) — tight, for crispness
 *   Layer 2: 0 4px 12px rgba(0,0,0,0.04) — diffuse, for depth
 * - Dark mode uses NO shadows; elevation is communicated purely through
 *   surface color differences.
 *
 * ### Component-Specific Patterns
 * - **Activity cards**: White card, 12px radius, athlete avatar (40px circle),
 *   bold title, stats row with icon + value pairs.
 * - **Segment badges**: Small pills with orange background (#FC4C02) and white
 *   text for KOM/QOM, gray pills for regular efforts.
 * - **Tab bar**: White/dark surface, orange active indicator dot or fill,
 *   gray (#8E8E93) for inactive icons.
 * - **Profile header**: Large hero area with gradient overlay on cover photo,
 *   white text, rounded avatar with white border.
 * - **Buttons**: Rounded-full (pill shape), orange primary with white text,
 *   ghost secondary with orange text and transparent background.
 * - **Bottom sheets**: Rounded top corners (20px), subtle handle bar (36×4px),
 *   blurred background on iOS.
 */

// ───────────────────────────────────────────────────────────────────────────────
// Primitives — raw color values, never used directly in components
// ───────────────────────────────────────────────────────────────────────────────

export const palette = {
  // Brand
  orange50: '#FFF4EC',
  orange100: '#FFE0C7',
  orange200: '#FFC299',
  orange300: '#FF9E61',
  orange400: '#FF7A2E',
  orange500: '#FC4C02', // Strava primary orange
  orange600: '#E04300',
  orange700: '#B83800',
  orange800: '#8C2B00',
  orange900: '#5C1D00',

  // Neutral — cool gray bias matching Strava's clean aesthetic
  white: '#FFFFFF',
  gray50: '#F7F7FA',
  gray100: '#F0F0F5',
  gray150: '#E8E8ED',
  gray200: '#D1D1D6',
  gray300: '#AEAEB2',
  gray400: '#8E8E93',
  gray500: '#6E6E73',
  gray600: '#545456',
  gray700: '#3A3A3C',
  gray800: '#2C2C2E',
  gray850: '#1C1C1E',
  gray900: '#161618',
  gray950: '#0A0A0B',
  black: '#000000',

  // Semantic
  green400: '#30D158',
  green500: '#34C759',
  green600: '#248A3D',
  amber400: '#FFB340',
  amber500: '#FF9500',
  amber600: '#C77C00',
  red400: '#FF6961',
  red500: '#FF3B30',
  red600: '#D70015',
  blue400: '#409CFF',
  blue500: '#007AFF',
  blue600: '#0056B3',

  // Transparent utilities
  blackAlpha4: 'rgba(0, 0, 0, 0.04)',
  blackAlpha6: 'rgba(0, 0, 0, 0.06)',
  blackAlpha8: 'rgba(0, 0, 0, 0.08)',
  blackAlpha12: 'rgba(0, 0, 0, 0.12)',
  blackAlpha20: 'rgba(0, 0, 0, 0.20)',
  blackAlpha40: 'rgba(0, 0, 0, 0.40)',
  blackAlpha60: 'rgba(0, 0, 0, 0.60)',
  whiteAlpha4: 'rgba(255, 255, 255, 0.04)',
  whiteAlpha8: 'rgba(255, 255, 255, 0.08)',
  whiteAlpha12: 'rgba(255, 255, 255, 0.12)',
  whiteAlpha20: 'rgba(255, 255, 255, 0.20)',
  whiteAlpha40: 'rgba(255, 255, 255, 0.40)',
  whiteAlpha60: 'rgba(255, 255, 255, 0.60)',

  // Strava-specific accent
  kudosOrange: '#FC4C02',
  premiumGold: '#FFB800',
  segmentPurple: '#6B4FA2',
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Semantic tokens — light mode
// ───────────────────────────────────────────────────────────────────────────────

export const lightColors = {
  // Backgrounds
  backgroundPrimary: palette.white, // Main screen canvas
  backgroundSecondary: palette.gray50, // Page background behind cards
  backgroundTertiary: palette.gray100, // Inset areas, grouped table bg
  backgroundElevated: palette.white, // Cards, sheets, modals

  // Text
  textPrimary: '#1D1D1F', // Headlines, body, athlete names
  textSecondary: palette.gray500, // Timestamps, labels, secondary info
  textTertiary: palette.gray300, // Placeholders, disabled text
  textInverse: palette.white, // Text on brand-colored surfaces
  textLink: palette.blue500, // Tappable links

  // Brand
  brandPrimary: palette.orange500, // CTAs, active states, brand accents
  brandPrimaryPressed: palette.orange600, // Pressed state for brand buttons
  brandPrimaryMuted: palette.orange50, // Light orange tint for backgrounds
  brandPrimaryMutedPressed: palette.orange100,

  // Borders & Separators
  borderDefault: palette.blackAlpha6, // Standard card/cell borders
  borderStrong: palette.blackAlpha12, // Emphasized borders (inputs)
  borderBrand: palette.orange500, // Active/selected borders
  separator: palette.blackAlpha6, // List separators
  separatorOpaque: palette.gray150, // Opaque separators (non-transparent)

  // Surfaces (for elevated components)
  surfaceCard: palette.white,
  surfaceSheet: palette.white,
  surfaceOverlay: palette.blackAlpha40, // Overlay behind modals
  surfaceInput: palette.gray50, // Text input backgrounds
  surfaceInputFocused: palette.white,

  // Icons
  iconPrimary: '#1D1D1F',
  iconSecondary: palette.gray400,
  iconTertiary: palette.gray300,
  iconBrand: palette.orange500,
  iconInverse: palette.white,

  // Tab bar
  tabBarBackground: palette.white,
  tabBarBorder: palette.blackAlpha8,
  tabBarActive: palette.orange500,
  tabBarInactive: palette.gray400,

  // Interactive states
  pressedOverlay: palette.blackAlpha4, // Pressed feedback on rows/cards
  hoverOverlay: palette.blackAlpha4, // Web hover state
  disabledOpacity: 0.38,

  // Semantic feedback
  success: palette.green500,
  successMuted: '#E8FAE8',
  warning: palette.amber500,
  warningMuted: '#FFF3E0',
  error: palette.red500,
  errorMuted: '#FFEBEE',
  info: palette.blue500,
  infoMuted: '#E3F2FD',

  // Shadows (React Native shadow props + elevation)
  shadowColor: palette.black,

  // Activity-specific
  kudos: palette.orange500,
  segmentKom: palette.orange500,
  segmentPr: palette.green500,

  // Badge
  badgePrimaryBg: palette.orange500,
  badgePrimaryText: palette.white,
  badgeSecondaryBg: palette.gray100,
  badgeSecondaryText: palette.gray600,

  // Skeleton / loading
  skeletonBase: palette.gray100,
  skeletonHighlight: palette.gray50,
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Semantic tokens — dark mode
// ───────────────────────────────────────────────────────────────────────────────

export const darkColors = {
  // Backgrounds — triple-layer dark surface hierarchy
  backgroundPrimary: palette.gray950, // Deepest bg
  backgroundSecondary: palette.gray900, // Slight elevation
  backgroundTertiary: palette.gray850, // Inset areas
  backgroundElevated: palette.gray850, // Cards, sheets, modals

  // Text
  textPrimary: '#F5F5F7',
  textSecondary: palette.gray300,
  textTertiary: palette.gray500,
  textInverse: palette.white,
  textLink: palette.blue400,

  // Brand
  brandPrimary: palette.orange500,
  brandPrimaryPressed: palette.orange400,
  brandPrimaryMuted: palette.orange900,
  brandPrimaryMutedPressed: palette.orange800,

  // Borders & Separators
  borderDefault: palette.whiteAlpha8,
  borderStrong: palette.whiteAlpha12,
  borderBrand: palette.orange500,
  separator: palette.whiteAlpha8,
  separatorOpaque: palette.gray800,

  // Surfaces
  surfaceCard: palette.gray850,
  surfaceSheet: palette.gray850,
  surfaceOverlay: palette.blackAlpha60,
  surfaceInput: palette.gray800,
  surfaceInputFocused: palette.gray700,

  // Icons
  iconPrimary: '#F5F5F7',
  iconSecondary: palette.gray400,
  iconTertiary: palette.gray600,
  iconBrand: palette.orange500,
  iconInverse: palette.white,

  // Tab bar
  tabBarBackground: palette.gray950,
  tabBarBorder: palette.whiteAlpha8,
  tabBarActive: palette.orange500,
  tabBarInactive: palette.gray400,

  // Interactive states
  pressedOverlay: palette.whiteAlpha4,
  hoverOverlay: palette.whiteAlpha4,
  disabledOpacity: 0.38,

  // Semantic feedback
  success: palette.green400,
  successMuted: '#0D2818',
  warning: palette.amber400,
  warningMuted: '#2C1F0B',
  error: palette.red400,
  errorMuted: '#2C0F0F',
  info: palette.blue400,
  infoMuted: '#0D1F36',

  // Shadows (not visually used in dark mode, but kept for API consistency)
  shadowColor: palette.black,

  // Activity-specific
  kudos: palette.orange500,
  segmentKom: palette.orange500,
  segmentPr: palette.green400,

  // Badge
  badgePrimaryBg: palette.orange500,
  badgePrimaryText: palette.white,
  badgeSecondaryBg: palette.gray800,
  badgeSecondaryText: palette.gray300,

  // Skeleton / loading
  skeletonBase: palette.gray800,
  skeletonHighlight: palette.gray850,
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Type exports
// ───────────────────────────────────────────────────────────────────────────────

export type ColorScheme = 'light' | 'dark';

/** Semantic color token shape (union of light and dark values) */
export type SemanticColors = typeof lightColors | typeof darkColors;

export type PaletteColors = typeof palette;

/**
 * Resolve semantic colors for the given scheme.
 */
export const getColors = (scheme: ColorScheme) =>
  scheme === 'dark' ? darkColors : lightColors;
