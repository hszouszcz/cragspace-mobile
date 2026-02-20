/**
 * Strava-Inspired Typography System
 * ──────────────────────────────────
 *
 * ## Design Analysis — Strava Typography
 *
 * Strava's type system is rooted in clarity, hierarchy, and athletic energy.
 * It relies on platform system fonts for maximum rendering quality and
 * performance (no custom font downloads needed).
 *
 * ### Font Families
 *
 * - **Primary (sans-serif)**: System font stack — SF Pro on iOS, Roboto on
 *   Android. This ensures native feel and optimal rendering with dynamic type
 *   support. Strava does NOT use a custom display typeface in the native app;
 *   it leans on weight and size contrast for hierarchy.
 *
 * - **Monospace**: SF Mono (iOS) / Roboto Mono (Android). Used sparingly for
 *   pace values (e.g., "5:23 /km"), timer displays, and elevation numbers
 *   where tabular alignment matters.
 *
 * ### Weight Usage
 *
 * | Weight | Name       | Usage                                             |
 * |--------|------------|---------------------------------------------------|
 * | 400    | Regular    | Body text, descriptions, comments                 |
 * | 500    | Medium     | Secondary labels, metadata, input text             |
 * | 600    | Semibold   | Section headers, stat labels, button text          |
 * | 700    | Bold       | Activity titles, athlete names, large stats        |
 * | 800    | ExtraBold  | Hero stats on profile, challenge numbers           |
 *
 * Strava avoids light/thin weights entirely — everything feels sturdy
 * and confident, reflecting the athletic brand identity.
 *
 * ### Type Scale
 *
 * The scale follows a combination of iOS Dynamic Type sizes and Strava's
 * custom hierarchy:
 *
 * | Token        | Size | Line Height | Weight    | Usage                        |
 * |--------------|------|-------------|-----------|------------------------------|
 * | heroStat     | 44px | 48px        | ExtraBold | Profile hero distance/stats  |
 * | displayLg    | 34px | 40px        | Bold      | Onboarding headlines         |
 * | displaySm    | 28px | 34px        | Bold      | Screen titles, modal titles  |
 * | headlineLg   | 22px | 28px        | Bold      | Section headers              |
 * | headlineSm   | 20px | 26px        | Semibold  | Card titles, activity names  |
 * | titleLg      | 17px | 22px        | Semibold  | List item primary text       |
 * | titleSm      | 15px | 20px        | Semibold  | Compact list titles          |
 * | bodyLg       | 17px | 24px        | Regular   | Body text, descriptions      |
 * | bodySm       | 15px | 20px        | Regular   | Secondary body, comments     |
 * | labelLg      | 15px | 20px        | Medium    | Button labels, tab labels    |
 * | labelSm      | 13px | 18px        | Medium    | Badges, timestamps, captions |
 * | captionLg    | 13px | 18px        | Regular   | Small descriptions           |
 * | captionSm    | 11px | 14px        | Regular   | Micro text, legal, footnotes |
 * | stat         | 20px | 24px        | Bold      | Inline stat values           |
 * | statLabel    | 11px | 14px        | Medium    | Stat labels ("Distance")     |
 * | mono         | 17px | 22px        | Medium    | Pace, timer, elevation       |
 * | monoSm       | 13px | 18px        | Medium    | Small numeric values         |
 *
 * ### Letter Spacing
 *
 * - Display/headline sizes: Slightly negative tracking (-0.2 to -0.5px) for
 *   tighter, more impactful headlines — a hallmark of athletic/sport UIs.
 * - Body text: Default (0px) or very slight positive tracking (+0.1px) for
 *   readability at smaller sizes.
 * - Labels/captions: Slight positive tracking (+0.2 to +0.5px) for clarity
 *   at small sizes, especially ALL-CAPS labels.
 * - Stat labels: Often uppercase with +0.8px tracking for a clean data feel.
 *
 * ### Special Typography Patterns
 *
 * - **Activity title**: Bold, 17px, near-black. Single line, truncated.
 * - **Stat blocks**: Large bold number + tiny uppercase label below.
 *   Center-aligned in a horizontal row with equal distribution.
 * - **Timestamps**: "2h ago" style, 13px medium gray, relative time.
 * - **Kudos count**: 13px semibold orange when active.
 * - **Tab labels**: 10px medium, slight uppercase tracking.
 */

import { Platform, TextStyle } from 'react-native';

// ───────────────────────────────────────────────────────────────────────────────
// Font family stacks — platform-aware
// ───────────────────────────────────────────────────────────────────────────────

export const fontFamily = Platform.select({
  ios: {
    sans: 'System', // Maps to SF Pro via React Native
    serif: 'Georgia',
    mono: 'Menlo',
    rounded: 'System', // Can use SF Rounded via UIFontDescriptor
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    mono: 'monospace',
    rounded: 'Roboto', // No native rounded; fall back to standard
  },
  default: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Courier',
    rounded: 'System',
  },
})!;

// ───────────────────────────────────────────────────────────────────────────────
// Font weights — React Native compatible string values
// ───────────────────────────────────────────────────────────────────────────────

export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Type scale — complete text style presets
// ───────────────────────────────────────────────────────────────────────────────

export const typeScale = {
  /** 44/48 ExtraBold — Profile hero stats (total distance, hours) */
  heroStat: {
    fontFamily: fontFamily.sans,
    fontSize: 44,
    lineHeight: 48,
    fontWeight: fontWeight.extrabold,
    letterSpacing: -0.5,
  } satisfies TextStyle,

  /** 34/40 Bold — Onboarding headlines, large display text */
  displayLg: {
    fontFamily: fontFamily.sans,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.4,
  } satisfies TextStyle,

  /** 28/34 Bold — Screen titles, modal headers */
  displaySm: {
    fontFamily: fontFamily.sans,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.3,
  } satisfies TextStyle,

  /** 22/28 Bold — Section headers, prominent headings */
  headlineLg: {
    fontFamily: fontFamily.sans,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.2,
  } satisfies TextStyle,

  /** 20/26 Semibold — Card titles, activity names */
  headlineSm: {
    fontFamily: fontFamily.sans,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.1,
  } satisfies TextStyle,

  /** 17/22 Semibold — List item primary, navigation titles */
  titleLg: {
    fontFamily: fontFamily.sans,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  } satisfies TextStyle,

  /** 15/20 Semibold — Compact list titles, secondary headers */
  titleSm: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0,
  } satisfies TextStyle,

  /** 17/24 Regular — Body text, descriptions, comments */
  bodyLg: {
    fontFamily: fontFamily.sans,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  } satisfies TextStyle,

  /** 15/20 Regular — Secondary body, comments, compact descriptions */
  bodySm: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.1,
  } satisfies TextStyle,

  /** 15/20 Medium — Button labels, tab labels, form labels */
  labelLg: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.1,
  } satisfies TextStyle,

  /** 13/18 Medium — Badges, timestamps, captions */
  labelSm: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.2,
  } satisfies TextStyle,

  /** 13/18 Regular — Small descriptions, tertiary info */
  captionLg: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.2,
  } satisfies TextStyle,

  /** 11/14 Regular — Micro text, legal footnotes, helper text */
  captionSm: {
    fontFamily: fontFamily.sans,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.3,
  } satisfies TextStyle,

  /** 20/24 Bold — Inline stat values (distance, pace, time) */
  stat: {
    fontFamily: fontFamily.sans,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.1,
  } satisfies TextStyle,

  /** 11/14 Medium Uppercase — Stat labels ("DISTANCE", "PACE") */
  statLabel: {
    fontFamily: fontFamily.sans,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  } satisfies TextStyle,

  /** 17/22 Medium Mono — Pace values, timer, elevation */
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
  } satisfies TextStyle,

  /** 13/18 Medium Mono — Small numeric displays */
  monoSm: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    letterSpacing: 0,
  } satisfies TextStyle,

  /** 10/14 Medium — Tab bar labels (compact) */
  tabLabel: {
    fontFamily: fontFamily.sans,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.3,
  } satisfies TextStyle,
} as const;

// ───────────────────────────────────────────────────────────────────────────────
// Type exports
// ───────────────────────────────────────────────────────────────────────────────

export type TypeScale = typeof typeScale;
export type TypeScaleKey = keyof TypeScale;
export type FontFamily = typeof fontFamily;
export type FontWeight = typeof fontWeight;
