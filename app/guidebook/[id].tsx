import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { GuidebookDetailList } from '@/features/GuidebookDetail/GuidebookDetailList';
import { GuidebookFiltersSheet } from '@/features/GuidebookDetail/components/GuidebookFiltersSheet';
import { HeaderActions } from '@/features/GuidebookDetail/components/HeaderActions';
import { useExpandedRegions } from '@/features/GuidebookDetail/useExpandedRegions';
import { useGroupedFiltersState } from '@/features/GuidebookDetail/useGroupedFiltersState';
import { useGuidebookDetailSearch } from '@/features/GuidebookDetail/useGuidebookDetailSearch';
import { SearchInputBar } from '@/features/SearchBar/SearchInputBar';
import { useSearchFiltersState } from '@/features/SearchBar/useSearchFiltersState';
import { GUIDEBOOK_DETAILS } from '@/services/guidebooks/guidebook-detail-data';
import type { GuidebookSearchResult } from '@/services/guidebooks/guidebook-detail-search';
import type { Sector } from '@/services/guidebooks/types';
import { sizes, spacing } from '@/src/theme';
import BottomSheet from '@gorhom/bottom-sheet';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GuidebookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const router = useRouter();
  const filtersSheetRef = useRef<BottomSheet>(null);

  const detail = GUIDEBOOK_DETAILS[id ?? ''];

  const { query, setQuery } = useSearchFiltersState({
    contextId: `guidebook-detail-search-${id}`,
    filters: [],
  });

  const {
    styleValue,
    setStyleFilter,
    gradeRange,
    setGradeRange,
    isGradeRangeDefault,
  } = useGroupedFiltersState();

  const hasActiveFilters = styleValue !== 'all' || !isGradeRangeDefault;

  const { expandedIds, toggle: toggleRegion } = useExpandedRegions(
    detail ? [detail.regions[0]?.id ?? ''] : [],
  );

  const { browseItems, searchResults, isSearching, stats } =
    useGuidebookDetailSearch({
      detail: detail!,
      query,
      filters: {
        style: styleValue,
        gradeRange:
          styleValue === 'all' &&
          gradeRange.min === 'I' &&
          gradeRange.max === 'VI.7'
            ? null
            : { min: gradeRange.min, max: gradeRange.max },
      },
      expandedIds,
    });

  const handleInfoPress = useCallback(() => {
    router.push({ pathname: '/guidebook/info/[id]', params: { id: id ?? '' } });
  }, [router, id]);

  const handleFilterPress = useCallback(() => {
    filtersSheetRef.current?.expand();
  }, []);

  const handleSectorPress = useCallback(
    (_sector: Sector, _regionId: string) => {
      // Navigate to sector detail — future feature
    },
    [],
  );

  const handleSearchResultPress = useCallback(
    (_result: GuidebookSearchResult) => {
      // Future: navigate to sector/route detail
    },
    [],
  );

  const handleFiltersSheetClose = useCallback(() => {
    filtersSheetRef.current?.close();
  }, []);

  if (!detail) {
    router.back();
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: detail.title,
          headerRight: () => <HeaderActions onInfoPress={handleInfoPress} />,
        }}
      />

      <SafeAreaView
        edges={['left', 'right']}
        style={[styles.screen, { backgroundColor: colors.backgroundPrimary }]}
      >
        {/* Sticky search + filter row */}
        <View
          style={[
            styles.stickyHeader,
            {
              backgroundColor: colors.backgroundPrimary,
              borderBottomColor: colors.separator,
            },
          ]}
        >
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <SearchInputBar
                query={query}
                placeholder="Search routes, sectors, regions…"
                onQueryChange={setQuery}
              />
            </View>
            <Pressable
              onPress={handleFilterPress}
              accessibilityRole="button"
              accessibilityLabel={
                hasActiveFilters ? 'Filters (active)' : 'Filters'
              }
              style={styles.filterButton}
              hitSlop={4}
            >
              <IconSymbol
                name="slider.horizontal.3"
                size={sizes.iconLg}
                color={
                  hasActiveFilters ? colors.brandPrimary : colors.iconSecondary
                }
              />
            </Pressable>
          </View>
        </View>

        <GuidebookDetailList
          isSearching={isSearching}
          browseItems={browseItems}
          searchResults={searchResults}
          stats={stats}
          gradeRange={detail.gradeRange}
          onToggleRegion={toggleRegion}
          onSectorPress={handleSectorPress}
          onSearchResultPress={handleSearchResultPress}
        />
      </SafeAreaView>

      <GuidebookFiltersSheet
        ref={filtersSheetRef}
        styleValue={styleValue}
        onStyleChange={setStyleFilter}
        gradeRange={gradeRange}
        onGradeRangeChange={setGradeRange}
        onClose={handleFiltersSheetClose}
      />
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  stickyHeader: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.lg,
  },
  searchInputWrapper: {
    flex: 1,
  },
  filterButton: {
    minWidth: sizes.minTapTarget,
    minHeight: sizes.minTapTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
