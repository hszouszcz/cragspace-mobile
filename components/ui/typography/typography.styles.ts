import { type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createTypographyStyles(colors: SemanticColors) {
  return StyleSheet.create({
    // Color variants
    primary: { color: colors.textPrimary },
    secondary: { color: colors.textSecondary },
    tertiary: { color: colors.textTertiary },
    inverse: { color: colors.textInverse },
    link: { color: colors.textLink },
    brand: { color: colors.brandPrimary },
    error: { color: colors.error },
    success: { color: colors.success },
  });
}
