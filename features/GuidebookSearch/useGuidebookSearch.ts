import { searchGuidebooks } from '@/services/guidebooks/search';
import type { Guidebook } from '@/services/guidebooks/types';
import { useEffect, useState } from 'react';

const DEBOUNCE_MS = 300;

export function useGuidebookSearch(
  guidebooks: Guidebook[],
  query: string,
  selectedStyles: string[],
): { results: Guidebook[]; isSearchActive: boolean } {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [query]);

  const hasStyleFilter = selectedStyles.some((v) => v !== 'all');
  const isSearchActive = debouncedQuery.trim().length > 0 || hasStyleFilter;

  const results = searchGuidebooks(guidebooks, debouncedQuery, selectedStyles);

  return { results, isSearchActive };
}
