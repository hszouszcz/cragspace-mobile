import { EmptyState } from '@/components/ui';
import type { GuidebookSearchResult } from '@/services/guidebooks/guidebook-detail-search';
import type { Sector } from '@/services/guidebooks/types';
import { spacing } from '@/src/theme';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
import { GuidebookStatsBar } from './components/GuidebookStatsBar';
import { RegionCard } from './components/RegionCard';
import { SearchResultRow } from './components/SearchResultRow';
import type { GuidebookListItem } from './types';

// ── Browse mode ───────────────────────────────────────────────────────────────

interface BrowseListProps {
  items: GuidebookListItem[];
  stats: { routes: number; sectors: number; regions: number };
  gradeRange: string;
  onToggleRegion: (regionId: string) => void;
  onSectorPress: (sector: Sector, regionId: string) => void;
}

function getItemType(item: GuidebookListItem): string {
  return item.type;
}

function BrowseList({
  items,
  stats,
  gradeRange,
  onToggleRegion,
  onSectorPress,
}: BrowseListProps) {
  function renderItem({ item }: { item: GuidebookListItem }) {
    switch (item.type) {
      case 'stats-bar':
        return (
          <GuidebookStatsBar
            totalRoutes={stats.routes}
            totalSectors={stats.sectors}
            gradeRange={gradeRange}
          />
        );
      case 'region':
        return (
          <RegionCard
            region={item.region}
            isExpanded={item.isExpanded}
            onToggle={onToggleRegion}
            onSectorPress={onSectorPress}
          />
        );
      case 'spacer':
        return <View style={styles.spacer} />;
    }
  }

  return (
    <FlashList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      getItemType={getItemType}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

// ── Search mode ───────────────────────────────────────────────────────────────

interface SearchListProps {
  results: GuidebookSearchResult[];
  onResultPress: (result: GuidebookSearchResult) => void;
}

function SearchList({ results, onResultPress }: SearchListProps) {
  if (results.length === 0) {
    return (
      <EmptyState
        title="Brak wyników"
        description="Spróbuj innej frazy lub zmień filtry"
      />
    );
  }

  return (
    <FlashList
      data={results}
      renderItem={({ item }) => (
        <SearchResultRow result={item} onPress={onResultPress} />
      )}
      keyExtractor={(item, index) =>
        item.type === 'region'
          ? `region-${item.region.id}`
          : item.type === 'sector'
            ? `sector-${item.sector.id}`
            : `route-${item.route.id}-${index}`
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

// ── Public component ──────────────────────────────────────────────────────────

interface GuidebookDetailListProps {
  isSearching: boolean;
  browseItems: GuidebookListItem[];
  searchResults: GuidebookSearchResult[];
  stats: { routes: number; sectors: number; regions: number };
  gradeRange: string;
  onToggleRegion: (regionId: string) => void;
  onSectorPress: (sector: Sector, regionId: string) => void;
  onSearchResultPress: (result: GuidebookSearchResult) => void;
}

export function GuidebookDetailList({
  isSearching,
  browseItems,
  searchResults,
  stats,
  gradeRange,
  onToggleRegion,
  onSectorPress,
  onSearchResultPress,
}: GuidebookDetailListProps) {
  if (isSearching) {
    return (
      <SearchList results={searchResults} onResultPress={onSearchResultPress} />
    );
  }

  return (
    <BrowseList
      items={browseItems}
      stats={stats}
      gradeRange={gradeRange}
      onToggleRegion={onToggleRegion}
      onSectorPress={onSectorPress}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: spacing.lg,
  },
  spacer: {
    height: spacing['4xl'],
  },
});
