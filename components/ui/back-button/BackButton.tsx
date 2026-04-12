import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { sizes } from '@/src/theme';
import { Pressable, StyleSheet } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={styles.button}
    >
      <IconSymbol
        name="chevron.left"
        size={sizes.iconLg}
        color={colors.iconPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: sizes.minTapTarget,
    minHeight: sizes.minTapTarget,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
