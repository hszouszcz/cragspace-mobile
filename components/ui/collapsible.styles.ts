import { type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createCollapsibleStyles(colors: SemanticColors) {
  return StyleSheet.create({
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    content: {
      marginTop: 6,
      marginLeft: 24,
    },
    chevronOpen: {
      transform: [{ rotate: '90deg' }],
    },
    chevronClosed: {
      transform: [{ rotate: '0deg' }],
    },
  });
}
