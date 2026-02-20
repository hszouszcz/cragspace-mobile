import { spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createEmptyStateStyles(colors: SemanticColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    illustration: {
      width: 120,
      height: 120,
      marginBottom: spacing['2xl'],
    },
    title: {
      color: colors.textPrimary,
      textAlign: 'center',
    },
    description: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    actionWrapper: {
      marginTop: spacing.xl,
    },
  });
}
