import { EmptyState } from '@/components/ui';
import type { GuidebookSearchResult } from '@/services/guidebooks/guidebook-detail-search';
import { spacing } from '@/src/theme';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native';
import { SearchResultRow } from '@/features/GuidebookDetail/components/SearchResultRow';

interface Props {
  results: GuidebookSearchResult[];
  onResultPress: (result: GuidebookSearchResult) => void;
}

export function SearchList({ results, onResultPress }: Props) {
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

const styles = StyleSheet.create({
  listContent: {
    paddingTop: spacing.lg,
  },
});
