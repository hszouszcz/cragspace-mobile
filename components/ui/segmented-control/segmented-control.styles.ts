import { radii, sizes, spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createSegmentedControlStyles(
  colors: SemanticColors,
  isDark: boolean,
) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundTertiary,
      borderRadius: radii.sm,
      padding: spacing.xxs,
      height: sizes.buttonSm,
    },
    segment: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.xs,
      paddingHorizontal: spacing.sm,
    },
    segmentActive: {
      backgroundColor: isDark ? colors.backgroundElevated : colors.surfaceCard,
    },
    segmentInactive: {
      backgroundColor: 'transparent',
    },
    labelActive: {
      color: colors.textPrimary,
    },
    labelInactive: {
      color: colors.textSecondary,
    },
  });
}
