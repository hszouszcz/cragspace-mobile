import {
  computeFilteredStats,
  filterGuidebookRegions,
  searchGuidebookContent,
  type GuidebookDetailFilters,
  type GuidebookSearchResult,
} from '@/services/guidebooks/guidebook-detail-search';
import type { GuidebookDetail, Region } from '@/services/guidebooks/types';
import { useEffect, useState } from 'react';
import type { GuidebookListItem } from './types';

const DEBOUNCE_MS = 250;

interface UseGuidebookDetailSearchOptions {
  detail: GuidebookDetail;
  query: string;
  filters: GuidebookDetailFilters;
  expandedIds: ReadonlySet<string>;
}

interface UseGuidebookDetailSearchResult {
  /** Flat items for FlashList in browse (accordion) mode */
  browseItems: GuidebookListItem[];
  /** Flat ranked results when a search query is active */
  searchResults: GuidebookSearchResult[];
  /** True when a non-empty query is typed */
  isSearching: boolean;
  /** Filtered region tree — used to build browseItems and render stats */
  filteredRegions: Region[];
  stats: { routes: number; sectors: number; regions: number };
}

function buildBrowseItems(
  regions: Region[],
  expandedIds: ReadonlySet<string>,
): GuidebookListItem[] {
  const items: GuidebookListItem[] = [{ type: 'stats-bar', id: 'stats-bar' }];

  for (const region of regions) {
    const isExpanded = expandedIds.has(region.id);
    items.push({
      type: 'region-header',
      id: `region-${region.id}`,
      region,
      isExpanded,
    });

    if (isExpanded) {
      for (const sector of region.sectors) {
        items.push({
          type: 'sector-row',
          id: `sector-${sector.id}`,
          sector,
          regionId: region.id,
        });
      }
    }
  }

  items.push({ type: 'spacer', id: 'bottom-spacer' });
  return items;
}

export function useGuidebookDetailSearch({
  detail,
  query,
  filters,
  expandedIds,
}: UseGuidebookDetailSearchOptions): UseGuidebookDetailSearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const isSearching = debouncedQuery.trim().length > 0;

  const filteredRegions = filterGuidebookRegions(detail, filters);
  const stats = computeFilteredStats(filteredRegions);

  const browseItems = buildBrowseItems(filteredRegions, expandedIds);

  const searchResults = isSearching
    ? searchGuidebookContent(detail, debouncedQuery, filters)
    : [];

  return {
    browseItems,
    searchResults,
    isSearching,
    filteredRegions,
    stats,
  };
}
