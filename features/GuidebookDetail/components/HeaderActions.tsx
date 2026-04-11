import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { sizes, spacing } from '@/src/theme';
import { Pressable, StyleSheet, View } from 'react-native';

interface HeaderActionsProps {
  onInfoPress: () => void;
}

export function HeaderActions({ onInfoPress }: HeaderActionsProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onInfoPress}
        accessibilityRole="button"
        accessibilityLabel="Guidebook information"
        style={styles.button}
        hitSlop={8}
      >
        <IconSymbol
          name="info.circle"
          size={sizes.iconLg}
          color={colors.iconPrimary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  button: {
    minWidth: sizes.minTapTarget,
    minHeight: sizes.minTapTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
