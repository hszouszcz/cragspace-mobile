import { useThemeColors } from '@/components/ui/use-theme-colors';
import { spacing, typeScale } from '@/src/theme';
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
          backgroundColor: colors.backgroundSecondary,
          borderBottomColor: colors.separator,
        },
      ]}
    >
      <View style={styles.stat}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {totalRoutes}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          ROUTES
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      <View style={styles.stat}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {totalSectors}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          SECTORS
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.separator }]} />

      <View style={styles.stat}>
        <Text
          style={[styles.value, { color: colors.textPrimary }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {gradeRange}
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          GRADE RANGE
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    ...typeScale.headlineLg,
    marginBottom: spacing.xxs,
  },
  label: {
    ...typeScale.labelSm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    marginHorizontal: spacing.sm,
  },
});
