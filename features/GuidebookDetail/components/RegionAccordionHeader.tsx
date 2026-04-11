import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { radii, sizes, spacing, typeScale } from '@/src/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { Region } from '@/services/guidebooks/types';

interface RegionAccordionHeaderProps {
  region: Region;
  isExpanded: boolean;
  onToggle: (regionId: string) => void;
}

export function RegionAccordionHeader({
  region,
  isExpanded,
  onToggle,
}: RegionAccordionHeaderProps) {
  const colors = useThemeColors();

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(isExpanded ? '180deg' : '0deg', { duration: 200 }),
      },
    ],
  }));

  return (
    <Pressable
      onPress={() => onToggle(region.id)}
      accessibilityRole="button"
      accessibilityLabel={region.name}
      accessibilityState={{ expanded: isExpanded }}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? colors.backgroundTertiary
            : colors.backgroundSecondary,
        },
      ]}
    >
      <View style={styles.left}>
        <Text
          style={[styles.name, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {region.name}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {region.sectorCount} {region.sectorCount === 1 ? 'sector' : 'sectors'}
        </Text>
      </View>

      <Animated.View style={chevronStyle}>
        <IconSymbol
          name="chevron.down"
          size={sizes.iconMd}
          color={colors.iconSecondary}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: sizes.minTapTarget,
    borderRadius: radii.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xs,
  },
  left: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    ...typeScale.titleLg,
  },
  meta: {
    ...typeScale.captionLg,
    marginTop: spacing.xxs,
  },
});
