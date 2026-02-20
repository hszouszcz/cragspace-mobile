import { spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createStatBlockStyles(colors: SemanticColors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      gap: spacing.xs,
    },
    value: {
      color: colors.textPrimary,
    },
    label: {
      color: colors.textSecondary,
    },
  });
}
