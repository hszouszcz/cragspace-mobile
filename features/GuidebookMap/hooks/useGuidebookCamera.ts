import type { CameraRef } from '@maplibre/maplibre-react-native';
import type { LngLatBounds } from '@maplibre/maplibre-react-native/src/types/LngLatBounds';
import { useRef } from 'react';

import type { Region } from '@/services/guidebooks/types';

interface GuidebookCameraConfig {
  cameraRef: React.RefObject<CameraRef>;
  /** Bounds as [west, south, east, north] — MapLibre v11 LngLatBounds format. */
  bounds: LngLatBounds;
}

/**
 * Computes the initial Camera bounds that fit all regions on screen.
 * The bounds are computed once from the region data (no reactive updates needed).
 */
export function useGuidebookCamera(regions: Region[]): GuidebookCameraConfig {
  const cameraRef = useRef<CameraRef>(null);

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const region of regions) {
    minLat = Math.min(minLat, region.bounds.se.lat);
    maxLat = Math.max(maxLat, region.bounds.nw.lat);
    minLng = Math.min(minLng, region.bounds.nw.lng);
    maxLng = Math.max(maxLng, region.bounds.se.lng);
  }

  // LngLatBounds: [west, south, east, north]
  return {
    cameraRef,
    bounds: [minLng, minLat, maxLng, maxLat],
  };
}
