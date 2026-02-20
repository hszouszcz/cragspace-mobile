/**
 * Strava-Inspired Spacing & Layout Tokens
 * ────────────────────────────────────────
 *
 * ## Design Analysis — Strava Spatial System
 *
 * Strava uses a strict **4px base grid** with an **8px primary step**,
 * which is the industry standard for mobile-first design systems. This creates
 * consistent rhythm and visual harmony across all screens.
 *
 * ### Spacing Scale Observations
 *
 * | Context                          | Value  | Token     |
 * |----------------------------------|--------|-----------|
 * | Icon internal padding            | 2px    | xxs       |
 * | Tight inline spacing (icon-text) | 4px    | xs        |
 * | Badge inner padding              | 6px    | sm-       |
 * | Compact row inner padding        | 8px    | sm        |
 * | Standard gap between elements    | 12px   | md        |
 * | Card inner padding               | 16px   | lg        |
 * | Section spacing                  | 20px   | xl        |
 * | Screen horizontal margin         | 16px   | lg        |
 * | Large section break              | 24px   | 2xl       |
 * | Hero section top padding         | 32px   | 3xl       |
 * | Modal top spacing                | 40px   | 4xl       |
 * | Empty state illustration gap     | 48px   | 5xl       |
 * | Screen vertical safe zone        | 64px   | 6xl       |
 *
 * ### Layout Patterns
 *
 * - **Screen padding**: 16px horizontal on phones, 20px on tablets.
 * - **Card padding**: 16px all sides. Map preview area is edge-to-edge within
 *   the card (bleeds to card edges with 0px padding).
 * - **Section headers**: 20px top margin, 8px bottom margin before content.
 * - **List items**: 12px vertical padding, 16px horizontal. Separator inset
 *   is 16px from left (or 56px when there's a leading avatar).
 * - **Activity stats row**: Icons and values spaced 4px apart, stat groups
 *   spaced 16px apart.
 * - **Avatar sizes**: 32px (comment), 40px (activity card), 56px (profile
 *   list), 80px (profile header), 120px (own profile hero).
 * - **Button height**: 48px for primary actions, 36px for compact/secondary.
 * - **Input height**: 44px (iOS HIG minimum tap target).
 * - **Tab bar height**: 49px (iOS standard) + safe area.
 *
 * ### Border Radius
 *
 * - **Cards**: 12px — soft, modern, matches iOS app convention.
 * - **Buttons (pill)**: 999px (fully rounded / capsule).
 * - **Avatars**: 50% (circular).
 * - **Badges/chips**: 8px — slightly rounded rectangles.
 * - **Input fields**: 10px.
 * - **Bottom sheet**: 20px top-left, 20px top-right.
 * - **Map thumbnails inside cards**: 8px (slightly less than card).
 * - **Modals**: 16px.
 */

// ───────────────────────────────────────────────────────────────────────────────
// Spacing scale — based on 4px grid with 8px primary step
// ───────────────────────────────────────────────────────────────────────────────

export const spacing = {
  /** 2px — Micro spacing: icon internal padding, hairline gaps */
  xxs: 2,
  /** 4px — Tight inline spacing: icon ↔ text, badge internal */
  xs: 4,
  /** 6px — Small padding: compact badges, tight pills */
  sm_: 6,
  /** 8px — Small: compact row padding, tight element gaps */
  sm: 8,
  /** 12px — Medium: standard gap between sibling elements */
  md: 12,
  /** 16px — Large: card padding, screen horizontal margins, stat group gaps */
  lg: 16,
  /** 20px — XL: section spacing, tablet screen margins */
  xl: 20,
  /** 24px — 2XL: large section breaks, header bottom margins */
  '2xl': 24,
  /** 32px — 3XL: hero section padding, prominent separations */
  '3xl': 32,
  /** 40px — 4XL: modal top spacing, onboarding gaps */
  '4xl': 40,
  /** 48px — 5XL: empty state gaps, large illustration spacing */
  '5xl': 48,
  /** 64px — 6XL: screen-level vertical safe zones */
  '6xl': 64,
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Border radius tokens
// ───────────────────────────────────────────────────────────────────────────────

export const radii = {
  /** 0px — No radius: squared elements */
  none: 0,
  /** 4px — Subtle: tags, inline code blocks */
  xs: 4,
  /** 8px — Small: badges, chips, map thumbnails inside cards */
  sm: 8,
  /** 10px — Medium: input fields */
  md: 10,
  /** 12px — Large: cards, activity cards, list group containers */
  lg: 12,
  /** 16px — XL: modals, dialog boxes */
  xl: 16,
  /** 20px — 2XL: bottom sheets (top corners) */
  '2xl': 20,
  /** 24px — 3XL: large modals, onboarding cards */
  '3xl': 24,
  /** 999px — Full / Pill: buttons, avatars, pills, search bars */
  full: 999,
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Fixed layout dimensions
// ───────────────────────────────────────────────────────────────────────────────

export const sizes = {
  // Tap targets & interactive elements
  /** Minimum tappable area per iOS HIG / Material guidelines */
  minTapTarget: 44,
  /** Primary button height */
  buttonLg: 48,
  /** Secondary / compact button height */
  buttonSm: 36,
  /** Standard input field height */
  inputHeight: 44,
  /** Standard iOS tab bar height (excluding safe area) */
  tabBarHeight: 49,

  // Avatars
  avatarXs: 24,
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 56,
  avatarXl: 80,
  avatarHero: 120,

  // Bottom sheet handle
  handleWidth: 36,
  handleHeight: 4,

  // Icons
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 28,

  // Separator
  separatorHeight: 0.5, // Hairline on retina (StyleSheet.hairlineWidth)

  // Screen
  maxContentWidth: 600, // Max width for content on tablets
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Shadow presets (React Native compatible)
// ───────────────────────────────────────────────────────────────────────────────

export const shadows = {
  /** No shadow */
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  /** Subtle card shadow — light mode only */
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  /** Standard card shadow — activity cards */
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  /** Elevated surface — modals, floating action buttons */
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  /** Prominent shadow — sheets, dropdowns */
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Type exports
// ───────────────────────────────────────────────────────────────────────────────

export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type Sizes = typeof sizes;
export type Shadows = typeof shadows;
