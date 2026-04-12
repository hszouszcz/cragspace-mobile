import { EmptyState, useThemeColors } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  FilterChipsRow,
  SearchInputBar,
  createSearchStateOptions,
  useSearchFiltersState,
} from '@/features/SearchBar';
import { useGuidebookSearch } from '@/features/GuidebookSearch/useGuidebookSearch';
import type { Guidebook } from '@/services/guidebooks/types';
import { sizes } from '@/src/theme';
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GuidebookHeroCard } from './components/GuidebookHeroCard';
import { GuidebookListCard } from './components/GuidebookListCard';
import { InfoCard } from './components/InfoCard';
import { SectionHeader } from './components/SectionHeader';
import {
  GUIDEBOOK_CONTEXT_CONFIG,
  GUIDEBOOK_FILTERS,
  SCREEN_ITEMS,
  SEARCH_CORPUS,
  cardColorFromId,
} from './data';
import { SEARCH_INPUT_HEIGHT, styles } from './index.styles';
import type { ScreenItem } from './types';

const ALL_FILTER_VALUE = 'all';

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<ScreenItem>,
);

function buildSearchItems(results: Guidebook[], query: string): ScreenItem[] {
  const trimmedQuery = query.trim();
  const label = trimmedQuery
    ? `${results.length} results for "${trimmedQuery}"`
    : `${results.length} results`;

  return [
    { type: 'section-header', id: 'search-header', title: label },
    ...results.map((g) => ({
      type: 'list-card' as const,
      id: `search-${g.id}`,
      guidebook: {
        id: g.id,
        title: g.title,
        subtitle: `${g.region} · ${g.country}`,
        color: cardColorFromId(g.id),
      },
    })),
    { type: 'spacer', id: 'bottom-spacer' },
  ];
}

function renderItem({ item }: { item: ScreenItem }) {
  switch (item.type) {
    case 'section-header':
      return <SectionHeader title={item.title} />;
    case 'hero-card':
      return <GuidebookHeroCard item={item.guidebook} />;
    case 'info-cards-row':
      return (
        <View style={styles.infoCardsRow}>
          <InfoCard icon="map" title="Offline Maps" subtitle="5,000+ areas" />
          <InfoCard
            icon="checkmark.seal.fill"
            title="Verified Data"
            subtitle="Crowdsourced"
          />
        </View>
      );
    case 'list-card':
      return <GuidebookListCard item={item.guidebook} />;
    case 'spacer':
      return <View style={styles.bottomSpacer} />;
  }
}

export default function SearchScreen() {
  const colors = useThemeColors();

  const scrollOffset = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  const { query, setQuery, selectedValues, toggleFilter } =
    useSearchFiltersState(createSearchStateOptions(GUIDEBOOK_CONTEXT_CONFIG));

  // Mutual exclusion for 'all' chip:
  // Tapping a specific style deselects 'all'; tapping 'all' clears all styles.
  const handleToggleFilter = (value: string) => {
    if (value === ALL_FILTER_VALUE) {
      selectedValues
        .filter((v) => v !== ALL_FILTER_VALUE)
        .forEach((v) => toggleFilter(v));
      if (!selectedValues.includes(ALL_FILTER_VALUE)) {
        toggleFilter(ALL_FILTER_VALUE);
      }
    } else {
      if (selectedValues.includes(ALL_FILTER_VALUE)) {
        toggleFilter(ALL_FILTER_VALUE);
      }
      toggleFilter(value);
    }
  };

  const { results, isSearchActive } = useGuidebookSearch(
    SEARCH_CORPUS,
    query,
    selectedValues,
  );

  // Reset scroll position when entering or leaving search mode
  useEffect(() => {
    scrollOffset.value = 0;
  }, [isSearchActive, scrollOffset]);

  const listData = isSearchActive
    ? buildSearchItems(results, query)
    : SCREEN_ITEMS;

  const searchInputAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollOffset.value,
      [0, SEARCH_INPUT_HEIGHT],
      [SEARCH_INPUT_HEIGHT, 0],
      Extrapolation.CLAMP,
    ),
    opacity: interpolate(
      scrollOffset.value,
      [0, SEARCH_INPUT_HEIGHT * 0.6],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    overflow: 'hidden',
  }));

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable accessibilityRole="button" accessibilityLabel="Profile">
              <IconSymbol
                name="person.crop.circle"
                size={sizes.iconXl}
                color={colors.iconPrimary}
              />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView
        edges={['left', 'right']}
        style={[styles.screen, { backgroundColor: colors.backgroundPrimary }]}
      >
        {/* Sticky header — lives outside the list */}
        <View
          style={[
            styles.stickyHeader,
            {
              backgroundColor: colors.backgroundPrimary,
              borderBottomColor: colors.separator,
            },
          ]}
        >
          {/* Search input — collapses on scroll */}
          <Animated.View
            style={[styles.searchInputWrapper, searchInputAnimatedStyle]}
          >
            <SearchInputBar
              query={query}
              placeholder={GUIDEBOOK_CONTEXT_CONFIG.placeholder}
              onQueryChange={setQuery}
            />
          </Animated.View>

          {/* Filter chips — always visible */}
          <FilterChipsRow
            filters={GUIDEBOOK_FILTERS}
            selectedValues={selectedValues}
            onToggleFilter={handleToggleFilter}
          />
        </View>

        {isSearchActive && results.length === 0 ? (
          <EmptyState
            title="No guidebooks found"
            description="Try a different search or clear filters"
          />
        ) : (
          <AnimatedFlashList
            data={listData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            getItemType={(item) => item.type}
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
}
