import { spacing, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createCollapsibleStyles(colors: SemanticColors) {
  return StyleSheet.create({
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm_,
    },
    content: {
      marginTop: spacing.sm_,
      marginLeft: spacing['2xl'],
    },
    chevronOpen: {
      transform: [{ rotate: '90deg' }],
    },
    chevronClosed: {
      transform: [{ rotate: '0deg' }],
    },
  });
}
