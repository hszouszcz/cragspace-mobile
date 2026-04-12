import { useThemeColors } from '@/components/ui/use-theme-colors';
import { radii, shadows, spacing, typeScale } from '@/src/theme';
import { StyleSheet, Text, View } from 'react-native';

interface GuidebookStatsBarProps {
  totalRoutes: number;
  totalSectors: number;
  gradeRange: string;
}

export function GuidebookStatsBar({
  totalRoutes,
  totalSectors,
  gradeRange,
}: GuidebookStatsBarProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceCard,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.stat}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          ROUTES
        </Text>
        <Text style={[styles.value, { color: colors.brandPrimary }]}>
          {totalRoutes}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      <View style={styles.stat}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          SECTORS
        </Text>
        <Text style={[styles.value, { color: colors.brandPrimary }]}>
          {totalSectors}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      <View style={styles.stat}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          GRADE
        </Text>
        <Text
          style={[styles.value, { color: colors.brandPrimary }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {gradeRange}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radii.lg,
    ...shadows.sm,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xxs,
  },
  label: {
    ...typeScale.labelSm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    ...typeScale.headlineLg,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    marginHorizontal: spacing.sm,
  },
});
