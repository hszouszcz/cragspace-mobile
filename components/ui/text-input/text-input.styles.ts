import { radii, sizes, spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createTextInputStyles(colors: SemanticColors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      height: sizes.inputHeight,
      backgroundColor: colors.surfaceInput,
      borderRadius: radii.md,
      paddingHorizontal: spacing.md,
      gap: spacing.sm,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    containerFocused: {
      backgroundColor: colors.surfaceInputFocused,
      borderColor: colors.borderBrand,
    },
    input: {
      flex: 1,
      height: '100%',
      color: colors.textPrimary,
      padding: 0,
    },
    leadingIcon: {
      width: sizes.iconMd,
      height: sizes.iconMd,
    },
    clearButton: {
      width: sizes.iconMd,
      height: sizes.iconMd,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Search bar pill variant
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: sizes.inputHeight,
      backgroundColor: colors.surfaceInput,
      borderRadius: radii.full,
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    searchContainerFocused: {
      backgroundColor: colors.surfaceInputFocused,
      borderColor: colors.borderBrand,
    },
  });
}
