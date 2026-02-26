import { sizes, spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createListItemStyles(colors: SemanticColors) {
  return StyleSheet.create({
    // Standard row (56px min height)
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    // Compact row (44px min height)
    containerCompact: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: sizes.minTapTarget,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    pressedOverlay: {
      backgroundColor: colors.pressedOverlay,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    primaryText: {
      color: colors.textPrimary,
    },
    secondaryText: {
      color: colors.textSecondary,
      marginTop: spacing.xxs,
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    chevron: {
      color: colors.iconSecondary,
    },
    separator: {
      height: sizes.separatorHeight,
      backgroundColor: colors.separator,
      marginLeft: spacing.lg,
    },
    separatorWithLeading: {
      height: sizes.separatorHeight,
      backgroundColor: colors.separator,
      marginLeft: 68, // 16px padding + 40px avatar + 12px gap
    },
  });
}
