import { StyleSheet } from 'react-native';
import { spacing, radii, shadows, type SemanticColors } from '@/src/theme';

export function createCardStyles(colors: SemanticColors, isDark: boolean) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceCard,
      borderRadius: radii.lg,
      overflow: 'hidden',
      ...(isDark ? shadows.none : shadows.md),
    },
    contentPadding: {
      padding: spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    separator: {
      height: 0.5,
      backgroundColor: colors.separator,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
  });
}
