import { useState } from 'react';

interface UseExpandedRegionsResult {
  expandedIds: ReadonlySet<string>;
  toggle: (regionId: string) => void;
  isExpanded: (regionId: string) => boolean;
}

export function useExpandedRegions(
  initialExpandedIds: string[] = [],
): UseExpandedRegionsResult {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(initialExpandedIds),
  );

  const toggle = (regionId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  };

  const isExpanded = (regionId: string) => expandedIds.has(regionId);

  return { expandedIds, toggle, isExpanded };
}
