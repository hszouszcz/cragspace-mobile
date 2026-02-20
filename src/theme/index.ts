/**
 * Strava-Inspired Theme — Unified Export
 * ───────────────────────────────────────
 *
 * Central barrel export for the entire design token system.
 * Import from `src/theme` to access all tokens.
 *
 * Usage:
 * ```ts
 * import { theme } from '@/src/theme';
 *
 * // Access colors for current scheme
 * const colors = theme.colors('dark');
 * <View style={{ backgroundColor: colors.backgroundPrimary }} />
 *
 * // Access spacing
 * <View style={{ padding: theme.spacing.lg }} />
 *
 * // Access typography
 * <Text style={theme.typography.typeScale.headlineSm} />
 *
 * // Access border radius
 * <View style={{ borderRadius: theme.radii.lg }} />
 * ```
 */

import {
  getColors,
  palette,
  type ColorScheme,
  type SemanticColors,
} from './colors';
import { radii, shadows, sizes, spacing } from './spacing';
import { fontFamily, fontWeight, typeScale } from './typography';

export {
  darkColors,
  getColors,
  lightColors,
  palette,
  type ColorScheme,
  type PaletteColors,
  type SemanticColors,
} from './colors';

export {
  radii,
  shadows,
  sizes,
  spacing,
  type Radii,
  type Shadows,
  type Sizes,
  type Spacing,
} from './spacing';

export {
  fontFamily,
  fontWeight,
  typeScale,
  type FontFamily,
  type FontWeight,
  type TypeScale,
  type TypeScaleKey,
} from './typography';

// ───────────────────────────────────────────────────────────────────────────────
// Convenience — pre-assembled theme object
// ───────────────────────────────────────────────────────────────────────────────

/**
 * Pre-assembled theme object for simplified access.
 *
 * ```ts
 * const { colors, spacing, radii } = theme;
 * const scheme = theme.colors('dark');
 * ```
 */
export const theme = {
  /** Resolve semantic colors for the given color scheme */
  colors: (scheme: ColorScheme): SemanticColors => getColors(scheme),

  /** Raw palette primitives (use sparingly — prefer semantic tokens) */
  palette,

  /** Spacing scale (4px grid) */
  spacing,

  /** Border radius presets */
  radii,

  /** Fixed layout dimensions (avatars, buttons, icons, etc.) */
  sizes,

  /** Shadow presets (React Native compatible) */
  shadows,

  /** Typography system */
  typography: {
    fontFamily,
    fontWeight,
    typeScale,
  },
} as const;

export type Theme = typeof theme;
