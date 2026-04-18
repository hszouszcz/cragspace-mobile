import { useThemeColors } from '@/components/ui/use-theme-colors';
import { spacing } from '@/src/theme';
import { StyleSheet, View } from 'react-native';

interface Props {
  count: number;
  activeIndex: number;
}

export function WallDotIndicator({ count, activeIndex }: Props) {
  const colors = useThemeColors();

  return (
    <View
      style={styles.container}
      accessibilityLabel={`Wall ${activeIndex + 1} of ${count}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor:
                i === activeIndex
                  ? colors.brandPrimary
                  : colors.separatorOpaque,
              width: i === activeIndex ? 16 : 6,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
