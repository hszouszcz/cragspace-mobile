import { radii, shadows, spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createFabStyles(colors: SemanticColors, isDark: boolean) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      right: spacing.lg,
      bottom: spacing.lg,
      width: 56,
      height: 56,
      borderRadius: radii.full,
      backgroundColor: colors.brandPrimary,
      alignItems: 'center',
      justifyContent: 'center',
      ...(isDark ? shadows.none : shadows.lg),
    },
    containerPressed: {
      backgroundColor: colors.brandPrimaryPressed,
    },
  });
}
