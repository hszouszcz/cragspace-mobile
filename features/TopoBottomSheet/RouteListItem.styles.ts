import { radii, sizes, spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createRouteListItemStyles(colors: SemanticColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: radii.lg,
      borderWidth: 1,
      marginBottom: spacing.md,
    },
    pressedOverlay: {
      backgroundColor: colors.pressedOverlay,
    },
    numberBadge: {
      width: sizes.avatarMd,
      height: sizes.avatarMd,
      borderRadius: radii.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    details: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    name: {
      flexShrink: 1,
    },
    metadataRow: {
      flexDirection: 'row',
      marginTop: spacing.sm_,
      justifyContent: 'flex-start',
      gap: spacing.md,
    },
    starIcon: {
      marginRight: spacing.xxs,
    },
  });
}
