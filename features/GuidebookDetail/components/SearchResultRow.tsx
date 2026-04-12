import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { sizes, spacing, typeScale } from '@/src/theme';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { GuidebookSearchResult } from '@/services/guidebooks/guidebook-detail-search';

const TYPE_ICON = {
  region: 'map',
  sector: 'book',
  route: 'star.fill',
} as const;

const TYPE_LABEL = {
  region: 'Region',
  sector: 'Sector',
  route: 'Route',
} as const;

interface SearchResultRowProps {
  result: GuidebookSearchResult;
  onPress: (result: GuidebookSearchResult) => void;
}

export function SearchResultRow({ result, onPress }: SearchResultRowProps) {
  const colors = useThemeColors();

  const title =
    result.type === 'region'
      ? result.region.name
      : result.type === 'sector'
        ? result.sector.name
        : result.route.name;

  const breadcrumb =
    result.type === 'region'
      ? null
      : result.type === 'sector'
        ? result.regionName
        : `${result.regionName}  ›  ${result.sectorName}`;

  const grade = result.type === 'route' ? result.route.grade : null;

  return (
    <Pressable
      onPress={() => onPress(result)}
      accessibilityRole="button"
      accessibilityLabel={title}
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
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <IconSymbol
          name={TYPE_ICON[result.type]}
          size={sizes.iconSm}
          color={colors.iconSecondary}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {grade != null && (
            <Text style={[styles.grade, { color: colors.brandPrimary }]}>
              {grade}
            </Text>
          )}
        </View>
        {breadcrumb != null && (
          <Text
            style={[styles.breadcrumb, { color: colors.textTertiary }]}
            numberOfLines={1}
          >
            {breadcrumb}
          </Text>
        )}
      </View>

      <View style={styles.typeTag}>
        <Text style={[styles.typeLabel, { color: colors.textTertiary }]}>
          {TYPE_LABEL[result.type]}
        </Text>
      </View>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typeScale.titleSm,
    flex: 1,
  },
  grade: {
    ...typeScale.labelSm,
  },
  breadcrumb: {
    ...typeScale.captionLg,
    marginTop: spacing.xxs,
  },
  typeTag: {
    marginLeft: spacing.sm,
  },
  typeLabel: {
    ...typeScale.captionSm,
  },
});
