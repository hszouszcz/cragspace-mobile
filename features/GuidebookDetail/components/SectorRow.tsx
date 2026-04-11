import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { radii, sizes, spacing, typeScale } from '@/src/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Sector } from '@/services/guidebooks/types';

const STYLE_LABEL: Record<string, string> = {
  sport: 'Sport',
  trad: 'Trad',
  bouldering: 'Boulder',
  alpine: 'Alpin',
  ice: 'Lód',
  mixed: 'Mixed',
  'via-ferrata': 'Ferrata',
};

interface SectorRowProps {
  sector: Sector;
  regionId: string;
  onPress: (sector: Sector, regionId: string) => void;
}

export function SectorRow({ sector, regionId, onPress }: SectorRowProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => onPress(sector, regionId)}
      accessibilityRole="button"
      accessibilityLabel={`${sector.name}, ${sector.routeCount} dróg`}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? colors.backgroundTertiary
            : colors.backgroundPrimary,
          borderBottomColor: colors.separator,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          <Text
            style={[styles.name, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {sector.name}
          </Text>
          <View style={styles.badges}>
            {sector.styles.map((style) => (
              <View
                key={style}
                style={[
                  styles.badge,
                  { backgroundColor: colors.backgroundTertiary },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: colors.textSecondary }]}
                >
                  {STYLE_LABEL[style] ?? style}
                </Text>
              </View>
            ))}
            {sector.approachMinutes != null && (
              <Text style={[styles.approach, { color: colors.textTertiary }]}>
                {sector.approachMinutes} min
              </Text>
            )}
          </View>
        </View>

        <View style={styles.right}>
          <Text style={[styles.routeCount, { color: colors.textSecondary }]}>
            {sector.routeCount}
          </Text>
          <Text style={[styles.routeLabel, { color: colors.textTertiary }]}>
            dróg
          </Text>
        </View>

        <IconSymbol
          name="chevron.right"
          size={sizes.iconMd}
          color={colors.iconTertiary}
          style={styles.chevron}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: spacing.lg * 2,
    marginRight: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.xs,
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
  },
  name: {
    ...typeScale.titleSm,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xxs,
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: radii.xs,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  badgeText: {
    ...typeScale.captionSm,
  },
  approach: {
    ...typeScale.captionSm,
  },
  right: {
    alignItems: 'flex-end',
    marginRight: spacing.xs,
  },
  routeCount: {
    ...typeScale.titleSm,
  },
  routeLabel: {
    ...typeScale.captionSm,
  },
  chevron: {
    marginLeft: spacing.xxs,
  },
});
