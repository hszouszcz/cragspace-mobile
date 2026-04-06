import { useThemeColors } from '@/components/ui';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  FilterChipsRow,
  SearchInputBar,
  createSearchStateOptions,
  useSearchFiltersState,
} from '@/features/SearchBar';
import { sizes } from '@/src/theme';
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
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
} from './data';
import { SEARCH_INPUT_HEIGHT, styles } from './index.styles';
import type { ScreenItem } from './types';

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<ScreenItem>,
);

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
            onToggleFilter={toggleFilter}
          />
        </View>

        <AnimatedFlashList
          data={SCREEN_ITEMS}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </>
  );
}
