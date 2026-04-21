import { IconSymbol } from '@/components/ui/icon-symbol';
import { SegmentedControl } from '@/components/ui/segmented-control/segmented-control';
import { useThemeColors } from '@/components/ui/use-theme-colors';
import { GuidebookDetailList } from '@/features/GuidebookDetail/GuidebookDetailList';
import { GuidebookFiltersSheet } from '@/features/GuidebookDetail/components/GuidebookFiltersSheet';
import { HeaderActions } from '@/features/GuidebookDetail/components/HeaderActions';
import { useExpandedRegions } from '@/features/GuidebookDetail/useExpandedRegions';
import { useGroupedFiltersState } from '@/features/GuidebookDetail/useGroupedFiltersState';
import { useGuidebookDetailSearch } from '@/features/GuidebookDetail/useGuidebookDetailSearch';
import { GuidebookMapView } from '@/features/GuidebookMap/GuidebookMapView';
import { SearchInputBar } from '@/features/SearchBar/SearchInputBar';
import { useSearchFiltersState } from '@/features/SearchBar/useSearchFiltersState';
import { GUIDEBOOK_DETAILS } from '@/services/guidebooks/guidebook-detail-data';
import type { GuidebookSearchResult } from '@/services/guidebooks/guidebook-detail-search';
import type { Sector } from '@/services/guidebooks/types';
import { shadows, sizes, spacing } from '@/src/theme';
import BottomSheet from '@gorhom/bottom-sheet';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GuidebookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();
  const router = useRouter();
  const filtersSheetRef = useRef<BottomSheet>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

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

  const handleInfoPress = () => {
    router.push({ pathname: '/guidebook/info/[id]', params: { id: id ?? '' } });
  };

  const handleFilterPress = () => {
    filtersSheetRef.current?.expand();
  };

  const handleSectorPress = (sector: Sector, _regionId: string) => {
    if (sector.walls.length === 0) return;
    router.push({
      pathname: '/sector/[sectorId]',
      params: { sectorId: sector.id, guidebookId: id ?? '' },
    });
  };

  const handleMapSectorPress = (sectorId: string) => {
    router.push({
      pathname: '/sector/[sectorId]',
      params: { sectorId, guidebookId: id ?? '' },
    });
  };

  const handleSearchResultPress = (_result: GuidebookSearchResult) => {
    // Future: navigate to sector/route detail
  };

  const handleFiltersSheetClose = () => {
    filtersSheetRef.current?.close();
  };

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
        {/* Sticky header: search bar (list mode only) + List/Map toggle */}
        <View style={styles.stickyHeader}>
          {viewMode === 'list' && (
            <SearchInputBar
              query={query}
              placeholder="Search routes, sectors, regions…"
              onQueryChange={setQuery}
              inputContainerStyle={{
                backgroundColor: colors.surfaceCard,
                shadowColor: colors.shadowColor,
                ...shadows.sm,
                elevation: 3,
              }}
              trailingAction={
                <Pressable
                  onPress={handleFilterPress}
                  accessibilityRole="button"
                  accessibilityLabel={
                    hasActiveFilters ? 'Filters (active)' : 'Filters'
                  }
                  hitSlop={8}
                >
                  <IconSymbol
                    name="slider.horizontal.3"
                    size={sizes.iconLg}
                    color={colors.brandPrimary}
                  />
                </Pressable>
              }
            />
          )}
          <View style={styles.viewToggle}>
            <SegmentedControl
              segments={['List', 'Map']}
              selectedIndex={viewMode === 'list' ? 0 : 1}
              onChange={(index) => setViewMode(index === 0 ? 'list' : 'map')}
            />
          </View>
        </View>

        {viewMode === 'list' ? (
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
        ) : (
          <GuidebookMapView
            detail={detail}
            onSectorPress={handleMapSectorPress}
          />
        )}
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
  },
  viewToggle: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
});
