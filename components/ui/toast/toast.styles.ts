import {
  palette,
  radii,
  shadows,
  spacing,
  type SemanticColors,
} from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createToastStyles(colors: SemanticColors, isDark: boolean) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? palette.gray100 : palette.gray900,
      borderRadius: radii.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      marginHorizontal: spacing.lg,
      gap: spacing.sm,
      ...(isDark ? shadows.none : shadows.lg),
    },
    containerMargin: {
      marginBottom: spacing.sm,
    },
    message: {
      flex: 1,
      color: isDark ? palette.gray850 : palette.white,
    },
    action: {
      color: colors.brandPrimary,
    },
  });
}
