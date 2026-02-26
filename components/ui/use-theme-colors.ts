import { useColorScheme } from '@/hooks/use-color-scheme';
import { getColors, type ColorScheme, type SemanticColors } from '@/src/theme';

/**
 * Returns the full semantic color token set for the current color scheme.
 *
 * Usage:
 * ```ts
 * const colors = useThemeColors();
 * <View style={{ backgroundColor: colors.backgroundPrimary }} />
 * ```
 */
export function useThemeColors(): SemanticColors {
  const scheme = useColorScheme() ?? 'light';
  return getColors(scheme as ColorScheme);
}

/**
 * Returns the current color scheme string ('light' | 'dark').
 */
export function useCurrentScheme(): ColorScheme {
  const scheme = useColorScheme() ?? 'light';
  return scheme as ColorScheme;
}
