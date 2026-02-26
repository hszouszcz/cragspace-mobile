import { sizes, type SemanticColors } from '@/src/theme';
import { StyleSheet } from 'react-native';

export function createSeparatorStyles(colors: SemanticColors) {
  return StyleSheet.create({
    hairline: {
      height: sizes.separatorHeight,
      backgroundColor: colors.separator,
    },
    hairlineOpaque: {
      height: sizes.separatorHeight,
      backgroundColor: colors.separatorOpaque,
    },
    section: {
      height: 8,
      backgroundColor: colors.backgroundTertiary,
    },
  });
}
