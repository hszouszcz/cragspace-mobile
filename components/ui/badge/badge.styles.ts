import { radii, spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createBadgeStyles(colors: SemanticColors) {
  return StyleSheet.create({
    // Primary badge (brand orange)
    primaryContainer: {
      backgroundColor: colors.badgePrimaryBg,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radii.sm,
      minHeight: 24,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
    primaryText: {
      color: colors.badgePrimaryText,
    },

    // Secondary badge (neutral gray)
    secondaryContainer: {
      backgroundColor: colors.badgeSecondaryBg,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radii.sm,
      minHeight: 24,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
    secondaryText: {
      color: colors.badgeSecondaryText,
    },
  });
}
