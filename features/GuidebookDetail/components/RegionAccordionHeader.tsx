import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { radii, shadows, sizes, spacing, typeScale } from '@/src/theme';
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

  const totalRoutes = region.sectors.reduce((acc, s) => acc + s.routeCount, 0);

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
            : colors.surfaceCard,
          shadowColor: colors.shadowColor,
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
          {region.sectorCount} {region.sectorCount === 1 ? 'SECTOR' : 'SECTORS'}
          {'  ·  '}
          {totalRoutes} ROUTES
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
    borderRadius: radii.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  left: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    ...typeScale.titleLg,
    fontWeight: '700',
  },
  meta: {
    ...typeScale.labelSm,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: spacing.xxs,
  },
});
