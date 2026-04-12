import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { KURTYKI_GRADES } from '@/services/guidebooks/types';
import { radii, sizes, spacing, typeScale } from '@/src/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Sector } from '@/services/guidebooks/types';

interface SectorRowProps {
  sector: Sector;
  regionId: string;
  onPress: (sector: Sector, regionId: string) => void;
}

function getGradeRange(sector: Sector): string | null {
  if (sector.routes.length === 0) return null;
  const indices = sector.routes
    .map((r) => KURTYKI_GRADES.indexOf(r.grade))
    .filter((i) => i >= 0);
  if (indices.length === 0) return null;
  const min = KURTYKI_GRADES[Math.min(...indices)];
  const max = KURTYKI_GRADES[Math.max(...indices)];
  return min === max ? min : `${min} · ${max}`;
}

export function SectorRow({ sector, regionId, onPress }: SectorRowProps) {
  const colors = useThemeColors();
  const gradeRange = getGradeRange(sector);

  return (
    <Pressable
      onPress={() => onPress(sector, regionId)}
      accessibilityRole="button"
      accessibilityLabel={`${sector.name}, ${sector.routeCount} routes`}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? colors.backgroundTertiary
            : colors.surfaceCard,
          borderBottomColor: colors.separator,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Left: name + meta info */}
        <View style={styles.left}>
          <Text
            style={[styles.name, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {sector.name}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.routeCount, { color: colors.textSecondary }]}>
              {sector.routeCount} routes
            </Text>

            {sector.approachMinutes != null && (
              <View style={styles.metaItem}>
                <IconSymbol
                  name="clock"
                  size={sizes.iconSm}
                  color={colors.iconTertiary}
                />
                <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                  {sector.approachMinutes} min
                </Text>
              </View>
            )}
          </View>

          {sector.sunExposure != null && (
            <View style={[styles.metaRow, styles.sunRow]}>
              <IconSymbol
                name="sun.max"
                size={sizes.iconSm}
                color={colors.iconTertiary}
              />
              <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                {sector.sunExposure}
              </Text>
            </View>
          )}
        </View>

        {/* Right: grade badge + chevron */}
        <View style={styles.right}>
          {gradeRange != null && (
            <View
              style={[
                styles.gradeBadge,
                { backgroundColor: colors.brandPrimaryMuted },
              ]}
            >
              <Text
                style={[styles.gradeBadgeText, { color: colors.brandPrimary }]}
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

const styles = StyleSheet.create({
  container: {
    marginLeft: spacing.lg * 2,
    marginRight: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingRight: spacing.xs,
    minHeight: sizes.minTapTarget,
  },
  left: {
    flex: 1,
    marginRight: spacing.sm,
  },
  name: {
    ...typeScale.titleSm,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  sunRow: {
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  routeCount: {
    ...typeScale.captionLg,
  },
  metaText: {
    ...typeScale.captionLg,
  },
  right: {
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
    fontWeight: '600',
  },
});
