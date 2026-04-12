import { spacing } from '@/src/theme';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
import type { Sector } from '@/services/guidebooks/types';
import type { GuidebookListItem } from '@/features/GuidebookDetail/types';
import { GuidebookStatsBar } from '@/features/GuidebookDetail/components/GuidebookStatsBar';
import { RegionCard } from '@/features/GuidebookDetail/components/RegionCard';

interface Props {
  items: GuidebookListItem[];
  stats: { routes: number; sectors: number; regions: number };
  gradeRange: string;
  onToggleRegion: (regionId: string) => void;
  onSectorPress: (sector: Sector, regionId: string) => void;
}

function getItemType(item: GuidebookListItem): string {
  return item.type;
}

export function BrowseList({
  items,
  stats,
  gradeRange,
  onToggleRegion,
  onSectorPress,
}: Props) {
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

const styles = StyleSheet.create({
  listContent: {
    paddingTop: spacing.lg,
  },
  spacer: {
    height: spacing['4xl'],
  },
});
