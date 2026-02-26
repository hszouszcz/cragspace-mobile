import { radii, sizes, spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createFilterPillStyles(colors: SemanticColors) {
  return StyleSheet.create({
    container: {
      height: sizes.buttonSm,
      borderRadius: radii.full,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
    },
    inactive: {
      backgroundColor: 'transparent',
      borderColor: colors.borderDefault,
    },
    active: {
      backgroundColor: colors.brandPrimaryMuted,
      borderColor: colors.borderBrand,
    },
    textInactive: {
      color: colors.textSecondary,
    },
    textActive: {
      color: colors.brandPrimary,
    },
  });
}
