/**
 * App Theme Constants
 * ───────────────────
 *
 * Re-exports the Strava-inspired design system from src/theme for simpler
 * imports throughout the app. Also contains any app-specific constants that
 * extend the base theme (e.g., topo-specific color tokens).
 *
 * Prefer importing from this file in app code:
 * ```ts
 * import { Colors, Fonts, PRIMARY_COLOR, getTopoColorTokens } from '@/constants/theme';
 * ```
 */

import { Platform } from 'react-native';
import {
  darkColors,
  getColors,
  lightColors,
  palette,
  type ColorScheme,
  type SemanticColors,
} from '../theme/colors';
import { radii, shadows, sizes, spacing } from '../theme/spacing';
import { fontFamily, fontWeight, typeScale } from '../theme/typography';

// ───────────────────────────────────────────────────────────────────────────────
// Backward-compatible exports (matches original constants/theme.ts API)
// ───────────────────────────────────────────────────────────────────────────────

export const PRIMARY_COLOR = palette.orange500; // '#FC4C02'

export const Colors = {
  light: {
    text: lightColors.textPrimary,
    background: lightColors.backgroundPrimary,
    tint: palette.orange500,
    icon: lightColors.iconSecondary,
    tabIconDefault: lightColors.tabBarInactive,
    tabIconSelected: palette.orange500,
  },
  dark: {
    text: darkColors.textPrimary,
    background: darkColors.backgroundPrimary,
    tint: darkColors.textPrimary,
    icon: darkColors.iconSecondary,
    tabIconDefault: darkColors.tabBarInactive,
    tabIconSelected: darkColors.textPrimary,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: fontFamily.sans,
    serif: fontFamily.serif,
    rounded: fontFamily.rounded,
    mono: fontFamily.mono,
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ───────────────────────────────────────────────────────────────────────────────
// Topo-specific color tokens (extended from base theme)
// ───────────────────────────────────────────────────────────────────────────────

export type TopoColorTokens = {
  sheetBackground: string;
  sheetBorder: string;
  handle: string;
  headerTitle: string;
  headerSubtitle: string;
  rowBase: string;
  rowBackground: string;
  rowBorder: string;
  rowMuted: string;
  rowMutedBorder: string;
  rowPressed: string;
  badgeBackground: string;
  badgeText: string;
  badgeMutedBackground: string;
  badgeMutedText: string;
  gradeBackground: string;
  gradeText: string;
  chevron: string;
  starEmpty: string;
  textPrimary: string;
  textMuted: string;
  filterBackground: string;
};

export const getTopoColorTokens = (
  scheme: 'light' | 'dark',
): TopoColorTokens => {
  if (scheme === 'dark') {
    return {
      sheetBackground: '#23150f',
      sheetBorder: '#2d1c15',
      handle: '#40302a',
      headerTitle: darkColors.textPrimary,
      headerSubtitle: PRIMARY_COLOR,
      rowBase: 'rgba(35, 21, 15, 0.4)',
      rowBackground: 'rgba(40, 26, 20, 0.6)',
      rowBorder: 'rgba(64, 48, 42, 0.7)',
      rowMuted: 'rgba(35, 21, 15, 0.6)',
      rowMutedBorder: 'rgba(64, 48, 42, 0.45)',
      rowPressed: 'rgba(60, 40, 32, 0.6)',
      badgeBackground: PRIMARY_COLOR,
      badgeText: palette.white,
      badgeMutedBackground: '#2f221c',
      badgeMutedText: '#a8a29e',
      gradeBackground: '#3b2a22',
      gradeText: darkColors.textPrimary,
      chevron: '#a8a29e',
      starEmpty: '#4b3b35',
      textPrimary: darkColors.textPrimary,
      textMuted: '#a8a29e',
      filterBackground: 'rgba(252, 76, 2, 0.12)',
    };
  }

  return {
    sheetBackground: lightColors.surfaceCard,
    sheetBorder: lightColors.separatorOpaque,
    handle: '#e2e8f0',
    headerTitle: lightColors.textPrimary,
    headerSubtitle: PRIMARY_COLOR,
    rowBase: lightColors.backgroundPrimary,
    rowBackground: lightColors.backgroundSecondary,
    rowBorder: `rgba(252, 76, 2, 0.2)`,
    rowMuted: lightColors.backgroundPrimary,
    rowMutedBorder: lightColors.separatorOpaque,
    rowPressed: lightColors.backgroundTertiary,
    badgeBackground: PRIMARY_COLOR,
    badgeText: palette.white,
    badgeMutedBackground: lightColors.backgroundTertiary,
    badgeMutedText: lightColors.textSecondary,
    gradeBackground: '#e2e8f0',
    gradeText: lightColors.textPrimary,
    chevron: '#94a3b8',
    starEmpty: '#e2e8f0',
    textPrimary: lightColors.textPrimary,
    textMuted: lightColors.textSecondary,
    filterBackground: 'rgba(252, 76, 2, 0.1)',
  };
};

// ───────────────────────────────────────────────────────────────────────────────
// Re-export full theme system for convenience
// ───────────────────────────────────────────────────────────────────────────────

export {
  darkColors,
  fontFamily,
  fontWeight,
  getColors,
  lightColors,
  palette,
  radii,
  shadows,
  sizes,
  spacing,
  typeScale,
};

export type { ColorScheme, SemanticColors };
