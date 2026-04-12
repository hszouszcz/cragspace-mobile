import type { Region, Sector } from '@/services/guidebooks/types';

/**
 * Flat list item union for FlashList in browse (accordion) mode.
 * Each item type maps to a distinct rendered component.
 */
export type GuidebookListItem =
  | { type: 'stats-bar'; id: string }
  | {
      type: 'region-header';
      id: string;
      region: Region;
      isExpanded: boolean;
    }
  | {
      type: 'sector-row';
      id: string;
      sector: Sector;
      regionId: string;
    }
  | { type: 'spacer'; id: string };
