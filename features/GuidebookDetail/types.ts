import type { Region } from '@/services/guidebooks/types';

/**
 * Flat list item union for FlashList in browse (accordion) mode.
 * Each region is a single item — the RegionCard component renders
 * both the header and expanded sectors internally.
 */
export type GuidebookListItem =
  | { type: 'stats-bar'; id: string }
  | {
      type: 'region';
      id: string;
      region: Region;
      isExpanded: boolean;
    }
  | { type: 'spacer'; id: string };
