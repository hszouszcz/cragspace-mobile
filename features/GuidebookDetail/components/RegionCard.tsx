import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { KURTYKI_GRADES } from '@/services/guidebooks/types';
import { radii, shadows, sizes, spacing, typeScale } from '@/src/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { Region, Sector } from '@/services/guidebooks/types';

// ── Grade range helper ────────────────────────────────────────────────────────

function getSectorGradeRange(sector: Sector): string | null {
  if (sector.routes.length === 0) return null;
  const indices = sector.routes
    .map((r) => KURTYKI_GRADES.indexOf(r.grade))
    .filter((i) => i >= 0);
  if (indices.length === 0) return null;
  const min = KURTYKI_GRADES[Math.min(...indices)];
  const max = KURTYKI_GRADES[Math.max(...indices)];
  return min === max ? min : `${min} · ${max}`;
}

// ── SectorItem (inside the card) ──────────────────────────────────────────────

interface SectorItemProps {
  sector: Sector;
  regionId: string;
  isLast: boolean;
  onPress: (sector: Sector, regionId: string) => void;
}

function SectorItem({ sector, regionId, isLast, onPress }: SectorItemProps) {
  const colors = useThemeColors();
  const gradeRange = getSectorGradeRange(sector);

  return (
    <Pressable
      onPress={() => onPress(sector, regionId)}
      accessibilityRole="button"
      accessibilityLabel={`${sector.name}, ${sector.routeCount} routes`}
      style={({ pressed }) => [
        styles.sectorContainer,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.separator,
        },
        pressed && { backgroundColor: colors.backgroundTertiary },
      ]}
    >
      <View style={styles.sectorContent}>
        {/* Left: name + meta */}
        <View style={styles.sectorLeft}>
          <Text
            style={[styles.sectorName, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {sector.name}
          </Text>

          <View style={styles.sectorMetaRow}>
            <Text style={[styles.sectorMeta, { color: colors.textSecondary }]}>
              {sector.routeCount} routes
            </Text>
            {sector.approachMinutes != null && (
              <View style={styles.sectorMetaItem}>
                <IconSymbol
                  name="clock"
                  size={sizes.iconSm}
                  color={colors.iconTertiary}
                />
                <Text
                  style={[styles.sectorMeta, { color: colors.textTertiary }]}
                >
                  {sector.approachMinutes} min
                </Text>
              </View>
            )}
          </View>

          {sector.sunExposure != null && (
            <View style={[styles.sectorMetaRow, styles.sectorSunRow]}>
              <IconSymbol
                name="sun.max"
                size={sizes.iconSm}
                color={colors.iconTertiary}
              />
              <Text style={[styles.sectorMeta, { color: colors.textTertiary }]}>
                {sector.sunExposure}
              </Text>
            </View>
          )}
        </View>

        {/* Right: grade badge + chevron */}
        <View style={styles.sectorRight}>
          {gradeRange != null && (
            <View
              style={[
                styles.gradeBadge,
                { backgroundColor: colors.brandPrimaryMuted },
              ]}
            >
              <Text
                style={[
                  styles.gradeBadgeText,
                  { color: colors.brandSecondary },
                ]}
              >
                {gradeRange}
              </Text>
            </View>
          )}
          <IconSymbol
            name="chevron.right"
            size={sizes.iconMd}
            color={colors.iconTertiary}
          />
        </View>
      </View>
    </Pressable>
  );
}

// ── RegionCard ────────────────────────────────────────────────────────────────

interface RegionCardProps {
  region: Region;
  isExpanded: boolean;
  onToggle: (regionId: string) => void;
  onSectorPress: (sector: Sector, regionId: string) => void;
}

export function RegionCard({
  region,
  isExpanded,
  onToggle,
  onSectorPress,
}: RegionCardProps) {
  const colors = useThemeColors();

  const totalRoutes = region.sectors.reduce((acc, s) => acc + s.routeCount, 0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(isExpanded ? '180deg' : '0deg', { duration: 200 }),
      },
    ],
  }));

  return (
    // Outer wrapper carries the shadow
    <View style={[styles.cardShadow, { shadowColor: colors.shadowColor }]}>
      {/* Inner wrapper clips the left accent to rounded corners */}
      <View style={[styles.cardInner, { backgroundColor: colors.surfaceCard }]}>
        {/* Orange left accent — only when expanded */}
        {isExpanded && (
          <View
            style={[
              styles.leftAccent,
              { backgroundColor: colors.brandPrimary },
            ]}
          />
        )}

        {/* Header — pressable toggle */}
        <Pressable
          onPress={() => onToggle(region.id)}
          accessibilityRole="button"
          accessibilityLabel={region.name}
          accessibilityState={{ expanded: isExpanded }}
          style={({ pressed }) =>
            pressed ? { backgroundColor: colors.backgroundTertiary } : {}
          }
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text
                style={[styles.regionName, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                {region.name}
              </Text>
              <Text
                style={[styles.regionMeta, { color: colors.textSecondary }]}
              >
                {region.sectorCount}{' '}
                {region.sectorCount === 1 ? 'SECTOR' : 'SECTORS'}
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
          </View>
        </Pressable>

        {/* Expanded sectors */}
        {isExpanded && (
          <>
            <View
              style={[styles.divider, { backgroundColor: colors.separator }]}
            />
            {region.sectors.map((sector, index) => (
              <SectorItem
                key={sector.id}
                sector={sector}
                regionId={region.id}
                isLast={index === region.sectors.length - 1}
                onPress={onSectorPress}
              />
            ))}
          </>
        )}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Card shell
  cardShadow: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    ...shadows.sm,
  },
  cardInner: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },

  // Left accent
  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    zIndex: 1,
  },

  // Region header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: sizes.minTapTarget,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  regionName: {
    ...typeScale.titleLg,
  },
  regionMeta: {
    ...typeScale.labelSm,
    textTransform: 'uppercase',
    letterSpacing: typeScale.tabLabel.letterSpacing,
    marginTop: spacing.xxs,
  },

  // Separator between header and sectors
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: spacing.lg,
  },

  // Sector rows inside the card
  sectorContainer: {
    paddingHorizontal: spacing.lg,
  },
  sectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    minHeight: sizes.minTapTarget,
  },
  sectorLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  sectorName: {
    ...typeScale.titleSm,
  },
  sectorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  sectorSunRow: {
    marginTop: 2,
  },
  sectorMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  sectorMeta: {
    ...typeScale.captionLg,
  },
  sectorRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 0,
  },
  gradeBadge: {
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  gradeBadgeText: {
    ...typeScale.captionSm,
  },
});
