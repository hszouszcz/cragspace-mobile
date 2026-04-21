import { OfflineManager } from '@maplibre/maplibre-react-native';
import type {
  OfflinePackProgressListener,
  OfflinePackErrorListener,
} from '@maplibre/maplibre-react-native';
import { useEffect, useRef, useState } from 'react';

import type { GuidebookDetail } from '@/services/guidebooks/types';

export type OfflineStatus =
  | 'checking'
  | 'unknown'
  | 'downloading'
  | 'complete'
  | 'error';

interface UseOfflinePackResult {
  status: OfflineStatus;
  progress: number;
  startDownload: () => void;
}

const METADATA_KEY = 'guidebookId';

/**
 * Manages the offline tile pack lifecycle for a single guidebook.
 *
 * Pack is identified via metadata.guidebookId so it survives app restarts.
 * Covers the guidebook's bounding box at zoom levels 10–16.
 *
 * Bounds format for MapLibre v11: [west, south, east, north]
 */
export function useOfflinePack(
  detail: GuidebookDetail,
  bounds: { ne: [number, number]; sw: [number, number] },
  styleURL: string,
): UseOfflinePackResult {
  const [status, setStatus] = useState<OfflineStatus>('checking');
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    checkExistingPack();
    return () => {
      isMounted.current = false;
    };
  }, [detail.id]);

  const checkExistingPack = async () => {
    try {
      const packs = await OfflineManager.getPacks();
      const existing = packs.find(
        (p) => p.metadata[METADATA_KEY] === detail.id,
      );
      if (!isMounted.current) return;

      if (existing) {
        const packStatus = await existing.status();
        if (packStatus.state === 'complete') {
          setStatus('complete');
          setProgress(100);
        } else {
          // Pack exists but not complete (e.g. interrupted download)
          setStatus('unknown');
        }
      } else {
        setStatus('unknown');
      }
    } catch {
      if (isMounted.current) setStatus('unknown');
    }
  };

  const startDownload = async () => {
    setStatus('downloading');
    setProgress(0);

    const progressListener: OfflinePackProgressListener = (
      _pack,
      packStatus,
    ) => {
      if (!isMounted.current) return;
      setProgress(Math.round(packStatus.percentage));
      if (packStatus.state === 'complete') {
        setStatus('complete');
      }
    };

    const errorListener: OfflinePackErrorListener = () => {
      if (isMounted.current) setStatus('error');
    };

    try {
      await OfflineManager.createPack(
        {
          mapStyle: styleURL,
          // MapLibre v11 LngLatBounds: [west, south, east, north]
          bounds: [bounds.sw[0], bounds.sw[1], bounds.ne[0], bounds.ne[1]],
          minZoom: 10,
          maxZoom: 16,
          metadata: { [METADATA_KEY]: detail.id },
        },
        progressListener,
        errorListener,
      );
    } catch {
      if (isMounted.current) setStatus('error');
    }
  };

  return { status, progress, startDownload };
}
